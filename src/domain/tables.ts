/**
 * The statistical tables (付表) printed at the back of textbooks and handed out in
 * 統計検定: generated from src/domain/distributions.ts rather than typed in, so they
 * cannot contain transcription errors.
 */
import { chiSquare, fisherF, normalQuantile, normalSf, studentT, upperPoint } from './distributions';

export interface Table {
  rowLabel: string;
  colLabel: string;
  rows: number[];
  cols: number[];
  /** values[row][col] */
  values: number[][];
}

const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);
const DF_TAIL = [40, 60, 120, Infinity];

/** P(Z ≥ z): rows give z to one decimal, columns the second decimal. */
export function normalUpperTable(): Table {
  const rows = range(0, 34).map((i) => i / 10);
  const cols = range(0, 9).map((i) => i / 100);
  return {
    rowLabel: 'z',
    colLabel: '小数第2位',
    rows,
    cols,
    values: rows.map((r) => cols.map((c) => normalSf(Math.round((r + c) * 100) / 100))),
  };
}

export const NORMAL_POINTS = [0.1, 0.05, 0.025, 0.01, 0.005, 0.001];
export const normalPoint = (alpha: number) => normalQuantile(1 - alpha);

export const T_ALPHAS = [0.1, 0.05, 0.025, 0.01, 0.005];
export const T_DFS = [...range(1, 30), ...DF_TAIL];

export function tTable(): Table {
  return {
    rowLabel: '自由度',
    colLabel: 'α',
    rows: T_DFS,
    cols: T_ALPHAS,
    values: T_DFS.map((df) =>
      T_ALPHAS.map((a) => (Number.isFinite(df) ? upperPoint(studentT(df), a) : normalPoint(a))),
    ),
  };
}

export const CHI_ALPHAS = [0.995, 0.99, 0.975, 0.95, 0.9, 0.1, 0.05, 0.025, 0.01, 0.005];
export const CHI_DFS = [...range(1, 30), 40, 50, 60, 70, 80, 90, 100];

export function chiSquareTable(): Table {
  return {
    rowLabel: '自由度',
    colLabel: 'α',
    rows: CHI_DFS,
    cols: CHI_ALPHAS,
    values: CHI_DFS.map((df) => CHI_ALPHAS.map((a) => upperPoint(chiSquare(df), a))),
  };
}

export const F_ALPHAS = [0.05, 0.025, 0.01];
export const F_DF1 = [...range(1, 10), 12, 15, 20, 30, 60, Infinity];
export const F_DF2 = [...range(1, 30), ...DF_TAIL];

/** Upper α point of F(d1, d2), including the limiting cases d1 = ∞ or d2 = ∞. */
export function fPoint(d1: number, d2: number, alpha: number): number {
  const f1 = Number.isFinite(d1);
  const f2 = Number.isFinite(d2);
  if (f1 && f2) return upperPoint(fisherF(d1, d2), alpha);
  if (f1) return upperPoint(chiSquare(d1), alpha) / d1; // F(d1, ∞) = χ²(d1) / d1
  if (f2) return d2 / upperPoint(chiSquare(d2), 1 - alpha); // F(∞, d2) = d2 / χ²(d2)
  return 1;
}

export function fTable(alpha: number): Table {
  return {
    rowLabel: 'ν₂',
    colLabel: 'ν₁',
    rows: F_DF2,
    cols: F_DF1,
    values: F_DF2.map((d2) => F_DF1.map((d1) => fPoint(d1, d2, alpha))),
  };
}

/* ------------------------------ formatting ------------------------------ */

export const formatDf = (df: number) => (Number.isFinite(df) ? String(df) : '∞');

export function formatAlpha(alpha: number): string {
  return String(alpha);
}

/** Probabilities: four decimals, as printed in 統計検定. */
export const formatProbability = (p: number) => p.toFixed(4);

/** Percent points: three decimals, but three significant digits for tiny χ² values. */
export function formatPoint(x: number): string {
  if (x !== 0 && Math.abs(x) < 0.1) return x.toPrecision(3);
  return x.toFixed(3);
}
