/**
 * Probability distributions for the statistics tables (付表) and the calculator.
 *
 * Everything is computed from three special functions — log Γ, the regularized incomplete
 * gamma P(a, x) and the regularized incomplete beta I_x(a, b) — to roughly 1e-12 accuracy,
 * which is far more than the 3–4 printed decimals need. Pure TypeScript, no dependencies.
 */

const EPS = 1e-15;
const MAX_ITER = 500;
const TINY = 1e-300;

/* -------------------------- special functions -------------------------- */

const LANCZOS = [
  0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059,
  12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
];

/** ln Γ(x) for x > 0 (Lanczos, g = 7). */
export function logGamma(x: number): number {
  if (x < 0.5) return Math.log(Math.PI / Math.abs(Math.sin(Math.PI * x))) - logGamma(1 - x);
  const z = x - 1;
  let a = LANCZOS[0]!;
  const t = z + 7.5;
  for (let i = 1; i < 9; i++) a += LANCZOS[i]! / (z + i);
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(a);
}

const logBeta = (a: number, b: number) => logGamma(a) + logGamma(b) - logGamma(a + b);

/** Regularized lower incomplete gamma P(a, x). */
export function gammaP(a: number, x: number): number {
  if (x <= 0) return 0;
  if (!Number.isFinite(x)) return 1;
  if (x < a + 1) {
    // series
    let sum = 1 / a;
    let term = sum;
    for (let n = 1; n < MAX_ITER; n++) {
      term *= x / (a + n);
      sum += term;
      if (Math.abs(term) < Math.abs(sum) * EPS) break;
    }
    return sum * Math.exp(-x + a * Math.log(x) - logGamma(a));
  }
  return 1 - gammaQContinuedFraction(a, x);
}

/** Regularized upper incomplete gamma Q(a, x) = 1 − P(a, x), accurate in the far tail. */
export function gammaQ(a: number, x: number): number {
  if (x <= 0) return 1;
  if (!Number.isFinite(x)) return 0;
  return x < a + 1 ? 1 - gammaP(a, x) : gammaQContinuedFraction(a, x);
}

function gammaQContinuedFraction(a: number, x: number): number {
  // modified Lentz
  let b = x + 1 - a;
  let c = 1 / TINY;
  let d = 1 / b;
  let h = d;
  for (let i = 1; i < MAX_ITER; i++) {
    const an = -i * (i - a);
    b += 2;
    d = an * d + b;
    if (Math.abs(d) < TINY) d = TINY;
    c = b + an / c;
    if (Math.abs(c) < TINY) c = TINY;
    d = 1 / d;
    const delta = d * c;
    h *= delta;
    if (Math.abs(delta - 1) < EPS) break;
  }
  return Math.exp(-x + a * Math.log(x) - logGamma(a)) * h;
}

/** Regularized incomplete beta I_x(a, b). */
export function betaI(x: number, a: number, b: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const front = Math.exp(a * Math.log(x) + b * Math.log(1 - x) - logBeta(a, b));
  // The continued fraction converges fast for x < (a + 1) / (a + b + 2); use symmetry otherwise.
  if (x < (a + 1) / (a + b + 2)) return (front * betaContinuedFraction(x, a, b)) / a;
  return 1 - (front * betaContinuedFraction(1 - x, b, a)) / b;
}

function betaContinuedFraction(x: number, a: number, b: number): number {
  const qab = a + b;
  const qap = a + 1;
  const qam = a - 1;
  let c = 1;
  let d = 1 - (qab * x) / qap;
  if (Math.abs(d) < TINY) d = TINY;
  d = 1 / d;
  let h = d;
  for (let m = 1; m < MAX_ITER; m++) {
    const m2 = 2 * m;
    let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < TINY) d = TINY;
    c = 1 + aa / c;
    if (Math.abs(c) < TINY) c = TINY;
    d = 1 / d;
    h *= d * c;
    aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < TINY) d = TINY;
    c = 1 + aa / c;
    if (Math.abs(c) < TINY) c = TINY;
    d = 1 / d;
    const delta = d * c;
    h *= delta;
    if (Math.abs(delta - 1) < EPS) break;
  }
  return h;
}

/* ---------------------------- distributions ---------------------------- */

export interface Distribution {
  /** Continuous distributions have a density; discrete ones a probability mass. */
  discrete: boolean;
  /** Support, used to bracket quantile searches and to draw the curve. */
  min: number;
  max: number;
  pdf(x: number): number;
  /** P(X ≤ x) */
  cdf(x: number): number;
  /** P(X > x), computed directly so tail values keep their precision. */
  sf(x: number): number;
  mean: number;
  variance: number;
}

/** Standard normal upper tail Q(z) = P(Z > z). */
export function normalSf(z: number): number {
  if (z === 0) return 0.5;
  const q = 0.5 * gammaQ(0.5, (z * z) / 2);
  return z > 0 ? q : 1 - q;
}

export function normal(mu = 0, sigma = 1): Distribution {
  const z = (x: number) => (x - mu) / sigma;
  return {
    discrete: false,
    min: -Infinity,
    max: Infinity,
    pdf: (x) => Math.exp(-0.5 * z(x) ** 2) / (sigma * Math.sqrt(2 * Math.PI)),
    cdf: (x) => normalSf(-z(x)),
    sf: (x) => normalSf(z(x)),
    mean: mu,
    variance: sigma * sigma,
  };
}

export function studentT(df: number): Distribution {
  const logC = logGamma((df + 1) / 2) - logGamma(df / 2) - 0.5 * Math.log(df * Math.PI);
  const sf = (t: number) => {
    const tail = 0.5 * betaI(df / (df + t * t), df / 2, 0.5);
    return t >= 0 ? tail : 1 - tail;
  };
  return {
    discrete: false,
    min: -Infinity,
    max: Infinity,
    pdf: (t) => Math.exp(logC - ((df + 1) / 2) * Math.log(1 + (t * t) / df)),
    cdf: (t) => sf(-t),
    sf,
    mean: df > 1 ? 0 : NaN,
    variance: df > 2 ? df / (df - 2) : df > 1 ? Infinity : NaN,
  };
}

export function chiSquare(df: number): Distribution {
  const k = df / 2;
  return {
    discrete: false,
    min: 0,
    max: Infinity,
    pdf: (x) =>
      x < 0
        ? 0
        : x === 0
          ? df === 2
            ? 0.5
            : df < 2
              ? Infinity
              : 0
          : Math.exp((k - 1) * Math.log(x) - x / 2 - k * Math.LN2 - logGamma(k)),
    cdf: (x) => gammaP(k, Math.max(0, x) / 2),
    sf: (x) => gammaQ(k, Math.max(0, x) / 2),
    mean: df,
    variance: 2 * df,
  };
}

export function fisherF(d1: number, d2: number): Distribution {
  const logC = 0.5 * d1 * Math.log(d1) + 0.5 * d2 * Math.log(d2) - logBeta(d1 / 2, d2 / 2);
  return {
    discrete: false,
    min: 0,
    max: Infinity,
    pdf: (x) =>
      x <= 0 ? 0 : Math.exp(logC + (d1 / 2 - 1) * Math.log(x) - ((d1 + d2) / 2) * Math.log(d2 + d1 * x)),
    cdf: (x) => (x <= 0 ? 0 : betaI((d1 * x) / (d1 * x + d2), d1 / 2, d2 / 2)),
    sf: (x) => (x <= 0 ? 1 : betaI(d2 / (d2 + d1 * x), d2 / 2, d1 / 2)),
    mean: d2 > 2 ? d2 / (d2 - 2) : NaN,
    variance: d2 > 4 ? (2 * d2 * d2 * (d1 + d2 - 2)) / (d1 * (d2 - 2) ** 2 * (d2 - 4)) : NaN,
  };
}

export function exponential(rate: number): Distribution {
  return {
    discrete: false,
    min: 0,
    max: Infinity,
    pdf: (x) => (x < 0 ? 0 : rate * Math.exp(-rate * x)),
    cdf: (x) => (x <= 0 ? 0 : -Math.expm1(-rate * x)),
    sf: (x) => (x <= 0 ? 1 : Math.exp(-rate * x)),
    mean: 1 / rate,
    variance: 1 / (rate * rate),
  };
}

export function binomial(n: number, p: number): Distribution {
  const logPmf = (k: number) =>
    logGamma(n + 1) - logGamma(k + 1) - logGamma(n - k + 1) + k * Math.log(p) + (n - k) * Math.log1p(-p);
  const pmf = (x: number) => {
    const k = Math.round(x);
    if (k !== x || k < 0 || k > n) return 0;
    if (p === 0) return k === 0 ? 1 : 0;
    if (p === 1) return k === n ? 1 : 0;
    return Math.exp(logPmf(k));
  };
  // P(X ≤ k) = I_{1−p}(n − k, k + 1)
  const cdf = (x: number) => {
    const k = Math.floor(x);
    if (k < 0) return 0;
    if (k >= n) return 1;
    return betaI(1 - p, n - k, k + 1);
  };
  const sf = (x: number) => {
    const k = Math.floor(x);
    if (k < 0) return 1;
    if (k >= n) return 0;
    return betaI(p, k + 1, n - k);
  };
  return { discrete: true, min: 0, max: n, pdf: pmf, cdf, sf, mean: n * p, variance: n * p * (1 - p) };
}

export function poisson(lambda: number): Distribution {
  const pmf = (x: number) => {
    const k = Math.round(x);
    if (k !== x || k < 0) return 0;
    return Math.exp(k * Math.log(lambda) - lambda - logGamma(k + 1));
  };
  // P(X ≤ k) = Q(k + 1, λ)
  const cdf = (x: number) => (x < 0 ? 0 : gammaQ(Math.floor(x) + 1, lambda));
  const sf = (x: number) => (x < 0 ? 1 : gammaP(Math.floor(x) + 1, lambda));
  return { discrete: true, min: 0, max: Infinity, pdf: pmf, cdf, sf, mean: lambda, variance: lambda };
}

/* ------------------------------ quantiles ------------------------------ */

/** Inverse standard normal (Acklam), polished with one Halley step: ~1e-15. */
export function normalQuantile(p: number): number {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  const a = [
    -39.69683028665376, 220.9460984245205, -275.928510446969, 138.357751867269, -30.66479806614716,
    2.506628277459239,
  ];
  const b = [
    -54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572,
  ];
  const c = [
    -0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968,
    2.938163982698783,
  ];
  const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
  const lo = 0.02425;
  let x: number;
  if (p < lo) {
    const q = Math.sqrt(-2 * Math.log(p));
    x =
      (((((c[0]! * q + c[1]!) * q + c[2]!) * q + c[3]!) * q + c[4]!) * q + c[5]!) /
      ((((d[0]! * q + d[1]!) * q + d[2]!) * q + d[3]!) * q + 1);
  } else if (p <= 1 - lo) {
    const q = p - 0.5;
    const r = q * q;
    x =
      ((((((a[0]! * r + a[1]!) * r + a[2]!) * r + a[3]!) * r + a[4]!) * r + a[5]!) * q) /
      (((((b[0]! * r + b[1]!) * r + b[2]!) * r + b[3]!) * r + b[4]!) * r + 1);
  } else {
    const q = Math.sqrt(-2 * Math.log(1 - p));
    x =
      -(((((c[0]! * q + c[1]!) * q + c[2]!) * q + c[3]!) * q + c[4]!) * q + c[5]!) /
      ((((d[0]! * q + d[1]!) * q + d[2]!) * q + d[3]!) * q + 1);
  }
  const e = normalSf(-x) - p;
  const u = e * Math.sqrt(2 * Math.PI) * Math.exp((x * x) / 2);
  return x - u / (1 + (x * u) / 2);
}

/**
 * Upper percentile point: the x with P(X > x) = alpha.
 * Continuous distributions are inverted by bisection on the survival function;
 * for discrete ones it returns the smallest k with P(X > k) ≤ alpha.
 */
export function upperPoint(dist: Distribution, alpha: number): number {
  if (alpha <= 0) return dist.max;
  if (alpha >= 1) return dist.min;
  if (dist.discrete) {
    let k = Math.max(0, Math.floor(dist.mean - 10 * Math.sqrt(dist.variance)));
    while (k > 0 && dist.sf(k - 1) <= alpha) k--;
    while (dist.sf(k) > alpha && k < dist.max) k++;
    return k;
  }
  // bracket
  let lo = Number.isFinite(dist.min) ? dist.min : -1;
  let hi = 1;
  while (dist.sf(lo) < alpha) lo = lo * 2 - 1;
  while (dist.sf(hi) > alpha) hi *= 2;
  for (let i = 0; i < 200 && hi - lo > 1e-13 * Math.max(1, Math.abs(hi)); i++) {
    const mid = (lo + hi) / 2;
    if (dist.sf(mid) > alpha) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/** Lower percentile point: the x with P(X ≤ x) = p. */
export const lowerPoint = (dist: Distribution, p: number) => upperPoint(dist, 1 - p);

/* ---------------------------- descriptive ---------------------------- */

export interface Describe {
  n: number;
  sum: number;
  mean: number;
  /** Divided by n. */
  variance: number;
  /** Divided by n − 1 (不偏分散). */
  unbiasedVariance: number;
  sd: number;
  unbiasedSd: number;
  min: number;
  max: number;
  median: number;
  /** Quartiles by the "median of each half" rule taught in Japanese high schools. */
  q1: number;
  q3: number;
}

const medianOf = (sorted: readonly number[]) => {
  const n = sorted.length;
  const mid = Math.floor(n / 2);
  return n % 2 ? sorted[mid]! : (sorted[mid - 1]! + sorted[mid]!) / 2;
};

export function describe(values: readonly number[]): Describe | null {
  const n = values.length;
  if (n === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const sum = values.reduce((s, v) => s + v, 0);
  const mean = sum / n;
  const ss = values.reduce((s, v) => s + (v - mean) ** 2, 0);
  const half = Math.floor(n / 2);
  const lower = sorted.slice(0, half);
  const upper = sorted.slice(n % 2 ? half + 1 : half);
  return {
    n,
    sum,
    mean,
    variance: ss / n,
    unbiasedVariance: n > 1 ? ss / (n - 1) : NaN,
    sd: Math.sqrt(ss / n),
    unbiasedSd: n > 1 ? Math.sqrt(ss / (n - 1)) : NaN,
    min: sorted[0]!,
    max: sorted[n - 1]!,
    median: medianOf(sorted),
    q1: lower.length ? medianOf(lower) : sorted[0]!,
    q3: upper.length ? medianOf(upper) : sorted[n - 1]!,
  };
}

export interface Regression {
  n: number;
  covariance: number;
  correlation: number;
  slope: number;
  intercept: number;
  rSquared: number;
}

/** Simple linear regression y = a + b x by least squares (covariance divided by n). */
export function regress(xs: readonly number[], ys: readonly number[]): Regression | null {
  const n = Math.min(xs.length, ys.length);
  if (n < 2) return null;
  const mx = xs.slice(0, n).reduce((s, v) => s + v, 0) / n;
  const my = ys.slice(0, n).reduce((s, v) => s + v, 0) / n;
  let sxx = 0;
  let syy = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    const dx = xs[i]! - mx;
    const dy = ys[i]! - my;
    sxx += dx * dx;
    syy += dy * dy;
    sxy += dx * dy;
  }
  if (sxx === 0) return null;
  const slope = sxy / sxx;
  const correlation = syy === 0 ? NaN : sxy / Math.sqrt(sxx * syy);
  return {
    n,
    covariance: sxy / n,
    correlation,
    slope,
    intercept: my - slope * mx,
    rSquared: correlation * correlation,
  };
}

/** Parses "1, 2 3\n4" (half- or full-width, any separator) into numbers; ignores junk tokens. */
export function parseNumberList(text: string): number[] {
  return text
    .replace(/[０-９．－]/g, (c) =>
      c === '．' ? '.' : c === '－' ? '-' : String.fromCharCode(c.charCodeAt(0) - 0xfee0),
    )
    .split(/[\s,、，;；]+/)
    .filter(Boolean)
    .map(Number)
    .filter((v) => Number.isFinite(v));
}
