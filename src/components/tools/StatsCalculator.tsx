/** 記述統計・回帰の計算 — summary statistics, a box plot and simple regression for pasted data. */
import { useState } from 'react';

import {
  describe,
  parseNumberList,
  regress,
  type Describe,
  type Regression,
} from '../../domain/distributions';
import { t } from '../../i18n';
import s from './Tools.module.css';

const fmt = (v: number) => (Number.isFinite(v) ? Number(v.toFixed(6)).toString() : '—');

function BoxPlot({ d }: { d: Describe }) {
  const W = 600;
  const H = 64;
  const pad = 12;
  const span = d.max - d.min || 1;
  const x = (v: number) => pad + ((v - d.min) / span) * (W - 2 * pad);
  const mid = H / 2 - 6;
  return (
    <svg className={s.plot} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={t.tools.statistics.boxPlot}>
      <line className={s.curve} x1={x(d.min)} x2={x(d.q1)} y1={mid} y2={mid} />
      <line className={s.curve} x1={x(d.q3)} x2={x(d.max)} y1={mid} y2={mid} />
      <line className={s.curve} x1={x(d.min)} x2={x(d.min)} y1={mid - 8} y2={mid + 8} />
      <line className={s.curve} x1={x(d.max)} x2={x(d.max)} y1={mid - 8} y2={mid + 8} />
      <rect className={s.box} x={x(d.q1)} y={mid - 14} width={Math.max(1, x(d.q3) - x(d.q1))} height={28} />
      <line className={s.mark} x1={x(d.median)} x2={x(d.median)} y1={mid - 14} y2={mid + 14} />
      {[d.min, d.q1, d.median, d.q3, d.max].map((v, i) => (
        <text key={i} className={s.tick} x={x(v)} y={H - 4} textAnchor="middle">
          {Number(v.toPrecision(4))}
        </text>
      ))}
    </svg>
  );
}

function Scatter({ xs, ys, r }: { xs: number[]; ys: number[]; r: Regression }) {
  const W = 600;
  const H = 260;
  const pad = 28;
  const [x0, x1] = [Math.min(...xs), Math.max(...xs)];
  const [y0, y1] = [Math.min(...ys), Math.max(...ys)];
  const sx = (v: number) => pad + ((v - x0) / (x1 - x0 || 1)) * (W - 2 * pad);
  const sy = (v: number) => H - pad - ((v - y0) / (y1 - y0 || 1)) * (H - 2 * pad);
  return (
    <svg className={s.plot} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={t.tools.statistics.scatter}>
      <line className={s.axis} x1={pad} x2={W - pad} y1={H - pad} y2={H - pad} />
      <line className={s.axis} x1={pad} x2={pad} y1={pad} y2={H - pad} />
      <line
        className={s.mark}
        x1={sx(x0)}
        x2={sx(x1)}
        y1={sy(r.intercept + r.slope * x0)}
        y2={sy(r.intercept + r.slope * x1)}
      />
      {xs.map((v, i) => (
        <circle key={i} className={s.dot} cx={sx(v)} cy={sy(ys[i]!)} r={3.5} />
      ))}
    </svg>
  );
}

export default function StatsCalculator() {
  const c = t.tools.statistics;
  const [rawX, setRawX] = useState('48 50 51 49 52');
  const [rawY, setRawY] = useState('');
  const xs = parseNumberList(rawX);
  const ys = parseNumberList(rawY);
  const d = describe(xs);
  const pairs = ys.length > 0;
  const mismatch = pairs && ys.length !== xs.length;
  const r = pairs && !mismatch ? regress(xs, ys) : null;

  const rows: [string, number][] = d
    ? [
        [c.n, d.n],
        [c.sum, d.sum],
        [c.mean, d.mean],
        [c.variance, d.variance],
        [c.unbiasedVariance, d.unbiasedVariance],
        [c.sd, d.sd],
        [c.unbiasedSd, d.unbiasedSd],
        [c.min, d.min],
        [c.q1, d.q1],
        [c.median, d.median],
        [c.q3, d.q3],
        [c.max, d.max],
        [c.range, d.max - d.min],
        [c.iqr, d.q3 - d.q1],
      ]
    : [];

  return (
    <div className={s.calc}>
      <div className={s.calcForm}>
        <label className="field">
          <span>{c.x}</span>
          <textarea
            className={s.dataInput}
            value={rawX}
            placeholder={c.placeholder}
            onChange={(e) => setRawX(e.target.value)}
          />
        </label>
        <label className="field">
          <span>{c.y}</span>
          <textarea
            className={s.dataInput}
            value={rawY}
            placeholder={c.placeholder}
            onChange={(e) => setRawY(e.target.value)}
          />
        </label>
        <p className="meta">{c.quartileNote}</p>
      </div>

      <div className={s.calcResult} aria-live="polite">
        {!d ? (
          <p className="meta">{c.empty}</p>
        ) : (
          <>
            <h3 className={s.subhead}>{c.summary}</h3>
            <dl className={s.statList}>
              {rows.map(([label, v]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd className="num">{fmt(v)}</dd>
                </div>
              ))}
            </dl>
            <BoxPlot d={d} />
          </>
        )}
        {mismatch && <p className={s.warn}>{c.mismatch(xs.length, ys.length)}</p>}
        {r && (
          <>
            <h3 className={s.subhead}>{c.regression}</h3>
            <dl className={s.statList}>
              <div>
                <dt>{c.covariance}</dt>
                <dd className="num">{fmt(r.covariance)}</dd>
              </div>
              <div>
                <dt>{c.correlation}</dt>
                <dd className="num">{fmt(r.correlation)}</dd>
              </div>
              <div>
                <dt>{c.line}</dt>
                <dd className="num">
                  y = {fmt(r.intercept)} {r.slope < 0 ? '−' : '+'} {fmt(Math.abs(r.slope))} x
                </dd>
              </div>
              <div>
                <dt>{c.rSquared}</dt>
                <dd className="num">{fmt(r.rSquared)}</dd>
              </div>
            </dl>
            <Scatter xs={xs} ys={ys} r={r} />
          </>
        )}
      </div>
    </div>
  );
}
