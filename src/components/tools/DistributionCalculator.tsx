/** 確率分布の計算 — probabilities and percent points with a sketch of the shaded area. */
import { useState } from 'react';

import {
  binomial,
  chiSquare,
  exponential,
  fisherF,
  normal,
  poisson,
  studentT,
  upperPoint,
  type Distribution,
} from '../../domain/distributions';
import { parseNumericInput } from '../../domain/grading';
import { t } from '../../i18n';
import s from './Tools.module.css';

type Kind = 'normal' | 't' | 'chi2' | 'f' | 'binom' | 'poisson' | 'exp';
type Mode = 'lower' | 'upper' | 'two' | 'between' | 'point' | 'equal';

interface Param {
  key: string;
  label: string;
  initial: string;
  valid: (v: number) => boolean;
}

const positive = (v: number) => v > 0;
const positiveInt = (v: number) => Number.isInteger(v) && v > 0;

const KINDS: Record<Kind, { params: Param[]; make: (p: number[]) => Distribution; symmetric?: boolean }> = {
  normal: {
    params: [
      { key: 'mu', label: 'μ', initial: '0', valid: Number.isFinite },
      { key: 'sigma', label: 'σ', initial: '1', valid: positive },
    ],
    make: ([mu, sigma]) => normal(mu, sigma),
    symmetric: true,
  },
  t: {
    params: [{ key: 'df', label: 'ν', initial: '10', valid: positive }],
    make: ([df]) => studentT(df!),
    symmetric: true,
  },
  chi2: {
    params: [{ key: 'df', label: 'ν', initial: '5', valid: positive }],
    make: ([df]) => chiSquare(df!),
  },
  f: {
    params: [
      { key: 'd1', label: 'ν₁', initial: '3', valid: positive },
      { key: 'd2', label: 'ν₂', initial: '20', valid: positive },
    ],
    make: ([d1, d2]) => fisherF(d1!, d2!),
  },
  binom: {
    params: [
      { key: 'n', label: 'n', initial: '20', valid: (v) => positiveInt(v) && v <= 100000 },
      { key: 'p', label: 'p', initial: '0.3', valid: (v) => v >= 0 && v <= 1 },
    ],
    make: ([n, p]) => binomial(n!, p!),
  },
  poisson: {
    params: [{ key: 'lambda', label: 'λ', initial: '3', valid: positive }],
    make: ([l]) => poisson(l!),
  },
  exp: {
    params: [{ key: 'rate', label: 'λ', initial: '1', valid: positive }],
    make: ([r]) => exponential(r!),
  },
};

const CONTINUOUS_MODES: Mode[] = ['lower', 'upper', 'two', 'between', 'point'];
const DISCRETE_MODES: Mode[] = ['equal', 'lower', 'upper', 'between'];

function formatValue(v: number): string {
  if (!Number.isFinite(v)) return v > 0 ? '∞' : v < 0 ? '−∞' : '—';
  if (v !== 0 && Math.abs(v) < 1e-4) {
    const [m, e] = v.toExponential(4).split('e');
    return `${m} × 10^${Number(e)}`;
  }
  return Number(v.toFixed(6)).toString();
}

const num = (raw: string) => parseNumericInput(raw) ?? NaN;

interface Outcome {
  label: string;
  value: number;
  /** x-range(s) to shade, in data units. */
  shade: [number, number][];
  marks: number[];
}

function evaluate(
  dist: Distribution,
  mode: Mode,
  x: number,
  a: number,
  b: number,
  alpha: number,
): Outcome | null {
  const c = dist.mean;
  switch (mode) {
    case 'equal':
      if (!Number.isInteger(x)) return null;
      return { label: `P(X = ${x})`, value: dist.pdf(x), shade: [[x, x]], marks: [x] };
    case 'lower':
      if (!Number.isFinite(x)) return null;
      return { label: `P(X ≤ ${x})`, value: dist.cdf(x), shade: [[-Infinity, x]], marks: [x] };
    case 'upper':
      if (!Number.isFinite(x)) return null;
      return {
        label: `P(X ≥ ${x})`,
        value: dist.discrete ? dist.sf(x - 1) : dist.sf(x),
        shade: [[x, Infinity]],
        marks: [x],
      };
    case 'two': {
      if (!Number.isFinite(x)) return null;
      const d = Math.abs(x - c);
      return {
        label: `P(|X − ${formatValue(c)}| ≥ ${formatValue(d)})`,
        value: Math.min(1, dist.cdf(c - d) + dist.sf(c + d)),
        shade: [
          [-Infinity, c - d],
          [c + d, Infinity],
        ],
        marks: [c - d, c + d],
      };
    }
    case 'between':
      if (!Number.isFinite(a) || !Number.isFinite(b) || a > b) return null;
      return {
        label: `P(${a} ≤ X ≤ ${b})`,
        value: dist.discrete ? dist.cdf(b) - dist.cdf(a - 1) : dist.cdf(b) - dist.cdf(a),
        shade: [[a, b]],
        marks: [a, b],
      };
    case 'point': {
      if (!(alpha > 0 && alpha < 1)) return null;
      const p = upperPoint(dist, alpha);
      return { label: `P(X ≥ x) = ${alpha} となる x`, value: p, shade: [[p, Infinity]], marks: [p] };
    }
  }
}

/* ------------------------------ plot ------------------------------ */

function plotRange(dist: Distribution): [number, number] {
  const q = (alpha: number) => upperPoint(dist, alpha);
  if (dist.discrete) return [Math.max(dist.min, q(0.9995) - 1), Math.min(dist.max, q(0.0005) + 1)];
  if (Number.isFinite(dist.min)) {
    // χ², F, exponential: stop where the tail is negligible, but not so far that the body is squashed.
    return [dist.min, Math.min(q(0.001), Math.max(q(0.5) * 6, q(0.05) * 1.6))];
  }
  // symmetric: centre ± the 0.01% point, kept narrow for heavy-tailed t with tiny ν
  const c = q(0.5);
  const half = Math.min(q(0.0001) - c, (q(0.025) - c) * 2.2);
  return [c - half, c + half];
}

/** Round tick values (1, 2 or 5 × 10ⁿ apart) inside [lo, hi], away from the clipped edges. */
function niceTicks(lo: number, hi: number, target = 5): number[] {
  const raw = (hi - lo) / target;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 5, 10].map((m) => m * mag).find((v) => v >= raw) ?? 10 * mag;
  const margin = (hi - lo) * 0.04;
  const out: number[] = [];
  for (let v = Math.ceil((lo + margin) / step) * step; v <= hi - margin; v += step)
    out.push(Math.round(v / step) * step);
  return out;
}

const formatTick = (v: number) => (Math.abs(v) < 1e-12 ? '0' : String(Number(v.toPrecision(6))));

function Plot({ dist, outcome }: { dist: Distribution; outcome: Outcome | null }) {
  const W = 600;
  const H = 200;
  const pad = { l: 8, r: 8, t: 10, b: 26 };
  const [x0, x1] = plotRange(dist);
  const span = x1 - x0 || 1;
  const sx = (x: number) => pad.l + ((x - x0) / span) * (W - pad.l - pad.r);
  const inShade = (x: number) => outcome?.shade.some(([a, b]) => x >= a - 1e-9 && x <= b + 1e-9) ?? false;

  let body: React.ReactNode;
  if (dist.discrete) {
    const ks = Array.from({ length: Math.min(400, Math.round(x1 - x0) + 1) }, (_, i) => Math.round(x0) + i);
    const peak = Math.max(...ks.map((k) => dist.pdf(k)), 1e-12);
    const sy = (p: number) => H - pad.b - (p / peak) * (H - pad.t - pad.b);
    const bw = Math.max(1, ((W - pad.l - pad.r) / ks.length) * 0.7);
    body = ks.map((k) => (
      <rect
        key={k}
        className={inShade(k) ? s.barOn : s.bar}
        x={sx(k) - bw / 2}
        y={sy(dist.pdf(k))}
        width={bw}
        height={H - pad.b - sy(dist.pdf(k))}
      />
    ));
  } else {
    const n = 240;
    const xs = Array.from({ length: n + 1 }, (_, i) => x0 + (span * i) / n);
    const ys = xs.map((x) => dist.pdf(x)).map((y) => (Number.isFinite(y) ? y : 0));
    // A density that diverges at 0 (χ² with ν = 1, F with ν₁ = 1) would flatten the rest of the curve.
    const peak = Math.max(...ys.slice(Number.isFinite(dist.min) ? 3 : 0), 1e-12);
    const sy = (p: number) => H - pad.b - (Math.min(p, peak) / peak) * (H - pad.t - pad.b);
    const line = xs.map((x, i) => `${sx(x).toFixed(1)},${sy(ys[i]!).toFixed(1)}`).join(' ');
    const areas = (outcome?.shade ?? []).map(([a, b], i) => {
      const from = Math.max(a, x0);
      const to = Math.min(b, x1);
      if (to <= from) return null;
      const pts = xs.filter((x) => x >= from && x <= to);
      const d = [
        `M${sx(from).toFixed(1)},${H - pad.b}`,
        `L${sx(from).toFixed(1)},${sy(dist.pdf(from)).toFixed(1)}`,
        ...pts.map((x) => `L${sx(x).toFixed(1)},${sy(dist.pdf(x)).toFixed(1)}`),
        `L${sx(to).toFixed(1)},${sy(dist.pdf(to)).toFixed(1)}`,
        `L${sx(to).toFixed(1)},${H - pad.b} Z`,
      ].join(' ');
      return <path key={i} className={s.area} d={d} />;
    });
    body = (
      <>
        {areas}
        <polyline className={s.curve} points={line} />
      </>
    );
  }

  const ticks = niceTicks(x0, x1);
  return (
    <svg className={s.plot} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={t.tools.distributions.plot}>
      {body}
      <line className={s.axis} x1={pad.l} x2={W - pad.r} y1={H - pad.b} y2={H - pad.b} />
      {ticks.map((x) => (
        <text key={x} className={s.tick} x={sx(x)} y={H - 8} textAnchor="middle">
          {formatTick(x)}
        </text>
      ))}
      {outcome?.marks
        .filter((m) => m >= x0 && m <= x1)
        .map((m, i) => (
          <line key={i} className={s.mark} x1={sx(m)} x2={sx(m)} y1={pad.t} y2={H - pad.b} />
        ))}
    </svg>
  );
}

/* ------------------------------ form ------------------------------ */

export default function DistributionCalculator() {
  const c = t.tools.distributions;
  const [kind, setKind] = useState<Kind>('normal');
  // Parameters are remembered per distribution, so switching back and forth keeps what was typed.
  const [params, setParams] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      Object.entries(KINDS).flatMap(([k, spec]) => spec.params.map((p) => [`${k}:${p.key}`, p.initial])),
    ),
  );
  const [mode, setMode] = useState<Mode>('upper');
  const [x, setX] = useState('1.96');
  const [a, setA] = useState('-1');
  const [b, setB] = useState('1');
  const [alpha, setAlpha] = useState('0.05');

  const spec = KINDS[kind];
  const values = spec.params.map((p) => num(params[`${kind}:${p.key}`] ?? ''));
  const paramsValid = spec.params.every((p, i) => p.valid(values[i]!));
  const dist = paramsValid ? spec.make(values) : null;
  const discrete = dist?.discrete ?? false;
  const modes = (discrete ? DISCRETE_MODES : CONTINUOUS_MODES).filter((m) => m !== 'two' || spec.symmetric);
  const activeMode = modes.includes(mode) ? mode : modes[0]!;
  const outcome = dist ? evaluate(dist, activeMode, num(x), num(a), num(b), num(alpha)) : null;

  const field = (id: string, label: string, value: string, onChange: (v: string) => void) => (
    <label className="field" key={id}>
      <span>{label}</span>
      <input className="input" inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );

  return (
    <div className={s.calc}>
      <div className={s.calcForm}>
        <label className="field">
          <span>{c.dist}</span>
          <select className="select" value={kind} onChange={(e) => setKind(e.target.value as Kind)}>
            {(Object.keys(KINDS) as Kind[]).map((k) => (
              <option key={k} value={k}>
                {c.kinds[k]}
              </option>
            ))}
          </select>
        </label>
        <div className={s.paramRow}>
          {spec.params.map((p) =>
            field(p.key, p.label, params[`${kind}:${p.key}`] ?? '', (v) =>
              setParams((prev) => ({ ...prev, [`${kind}:${p.key}`]: v })),
            ),
          )}
        </div>
        <fieldset className={s.modes}>
          <legend>{c.mode}</legend>
          {modes.map((m) => (
            <label key={m} className={s.modeOption}>
              <input type="radio" name="mode" checked={activeMode === m} onChange={() => setMode(m)} />
              {c.modes[m]}
            </label>
          ))}
        </fieldset>
        <div className={s.paramRow}>
          {(activeMode === 'lower' || activeMode === 'upper' || activeMode === 'two') &&
            field('x', 'x', x, setX)}
          {activeMode === 'equal' && field('k', 'k', x, setX)}
          {activeMode === 'between' && (
            <>
              {field('a', 'a', a, setA)}
              {field('b', 'b', b, setB)}
            </>
          )}
          {activeMode === 'point' && field('alpha', 'α', alpha, setAlpha)}
        </div>
      </div>

      <div className={s.calcResult} aria-live="polite">
        {!dist ? (
          <p className="meta">{c.invalid}</p>
        ) : (
          <>
            <p className={s.resultLabel}>{outcome ? outcome.label : c.invalidInput}</p>
            <p className={`${s.resultValue} num`}>{outcome ? formatValue(outcome.value) : '—'}</p>
            {activeMode === 'point' && spec.symmetric && outcome && (
              <p className="meta">{c.twoSided(num(alpha), formatValue(upperPoint(dist, num(alpha) / 2)))}</p>
            )}
            <Plot dist={dist} outcome={outcome} />
            <dl className={s.moments}>
              <div>
                <dt>{c.mean}</dt>
                <dd className="num">{formatValue(dist.mean)}</dd>
              </div>
              <div>
                <dt>{c.variance}</dt>
                <dd className="num">{formatValue(dist.variance)}</dd>
              </div>
            </dl>
          </>
        )}
      </div>
    </div>
  );
}
