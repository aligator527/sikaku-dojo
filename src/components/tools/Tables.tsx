/**
 * 付表 — statistical tables generated from src/domain/tables.ts.
 * The table components are hook-free, so Astro can render them to static HTML;
 * TablesPanel and TablesButton add tabs and a dialog for use inside drills and mocks.
 */
import { Table2, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import {
  chiSquareTable,
  F_ALPHAS,
  fTable,
  formatDf,
  formatPoint,
  formatProbability,
  NORMAL_POINTS,
  normalPoint,
  normalUpperTable,
  tTable,
  type Table,
} from '../../domain/tables';
import { t } from '../../i18n';
import s from './Tools.module.css';

export type TableId = 'normal' | 't' | 'chi2' | 'f';
export const TABLE_IDS: TableId[] = ['normal', 't', 'chi2', 'f'];

/** A sketch of the density with the shaded area the table gives. */
export function TailSketch({ shape, two = false }: { shape: 'bell' | 'skew'; two?: boolean }) {
  const w = 120;
  const h = 48;
  const xs = Array.from({ length: 61 }, (_, i) => i / 60);
  const y = (u: number) =>
    shape === 'bell'
      ? Math.exp(-((u - 0.5) ** 2) / (2 * 0.16 ** 2))
      : (Math.pow(u * 4, 1.6) * Math.exp(-u * 4 * 0.9)) / 1.05;
  const pt = (u: number) => `${(u * w).toFixed(1)},${(h - 4 - y(u) * (h - 10)).toFixed(1)}`;
  const curve = xs.map(pt).join(' ');
  const cut = shape === 'bell' ? 0.72 : 0.62;
  const tail = (from: number, to: number) =>
    `M${(from * w).toFixed(1)},${h - 4} L${xs
      .filter((u) => u >= from && u <= to)
      .map(pt)
      .join(' L')} L${(to * w).toFixed(1)},${h - 4} Z`;
  return (
    <svg className={s.sketch} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <path className={s.sketchArea} d={tail(cut, 1)} />
      {two && <path className={s.sketchArea} d={tail(0, 1 - cut)} />}
      <polyline className={s.sketchCurve} points={curve} />
      <line className={s.sketchAxis} x1="0" x2={w} y1={h - 4} y2={h - 4} />
      <text className={s.sketchLabel} x={cut * w} y={h} textAnchor="middle">
        {shape === 'bell' ? 'z' : 'x'}
      </text>
    </svg>
  );
}

function Grid({
  table,
  format,
  caption,
  colHead,
  rowHead = formatDf,
  groupEvery = 5,
}: {
  table: Table;
  format: (v: number) => string;
  caption: string;
  colHead: (c: number) => string;
  rowHead?: (r: number) => string;
  groupEvery?: number;
}) {
  return (
    <div className={s.tableScroll} tabIndex={0} role="region" aria-label={caption}>
      <table className={s.grid}>
        <caption className="visually-hidden">{caption}</caption>
        <thead>
          <tr>
            <th scope="col" className={s.corner}>
              <span>{table.rowLabel}</span>
              <span>{table.colLabel}</span>
            </th>
            {table.cols.map((c) => (
              <th scope="col" key={c}>
                {colHead(c)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((r, i) => (
            <tr key={r} className={(i + 1) % groupEvery === 0 ? s.groupEnd : undefined}>
              <th scope="row">{rowHead(r)}</th>
              {table.values[i]!.map((v, j) => (
                <td key={j}>{format(v)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function NormalTable() {
  const table = useMemo(normalUpperTable, []);
  return (
    <>
      <Grid
        table={table}
        caption={t.tools.tables.normal.title}
        format={formatProbability}
        colHead={(c) => c.toFixed(2)}
        rowHead={(r) => r.toFixed(1)}
      />
      <h4 className={s.subhead}>{t.tools.tables.normal.points}</h4>
      <div className={s.tableScroll}>
        <table className={s.grid}>
          <thead>
            <tr>
              <th scope="row" className={s.corner}>
                α
              </th>
              {NORMAL_POINTS.map((a) => (
                <th scope="col" key={a}>
                  {a}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">
                z<sub>α</sub>
              </th>
              {NORMAL_POINTS.map((a) => (
                <td key={a}>{formatPoint(normalPoint(a))}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export function TTable() {
  const table = useMemo(tTable, []);
  return <Grid table={table} caption={t.tools.tables.t.title} format={formatPoint} colHead={String} />;
}

export function ChiSquareTable() {
  const table = useMemo(chiSquareTable, []);
  return <Grid table={table} caption={t.tools.tables.chi2.title} format={formatPoint} colHead={String} />;
}

export function FTable({ alpha }: { alpha: number }) {
  const table = useMemo(() => fTable(alpha), [alpha]);
  return (
    <Grid
      table={table}
      caption={`${t.tools.tables.f.title}（α = ${alpha}）`}
      format={formatPoint}
      colHead={formatDf}
    />
  );
}

export function TableNote({ id }: { id: TableId }) {
  const copy = t.tools.tables[id];
  return (
    <div className={s.tableNote}>
      <TailSketch shape={id === 'normal' || id === 't' ? 'bell' : 'skew'} />
      <p>{copy.how}</p>
    </div>
  );
}

/** Tabbed tables, for the dialog opened from drills and mock exams. */
export function TablesPanel() {
  const [tab, setTab] = useState<TableId>('normal');
  const [alpha, setAlpha] = useState(F_ALPHAS[0]!);
  return (
    <div>
      <div className={s.tabBar} role="tablist" aria-label={t.tools.tables.title}>
        {TABLE_IDS.map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            className={s.tab}
            onClick={() => setTab(id)}
          >
            {t.tools.tables[id].short}
          </button>
        ))}
      </div>
      <div role="tabpanel" className={s.panel}>
        <TableNote id={tab} />
        {tab === 'normal' && <NormalTable />}
        {tab === 't' && <TTable />}
        {tab === 'chi2' && <ChiSquareTable />}
        {tab === 'f' && (
          <>
            <div className={s.alphaPick} role="radiogroup" aria-label="α">
              {F_ALPHAS.map((a) => (
                <label key={a} className={s.alphaOption}>
                  <input type="radio" name="f-alpha" checked={alpha === a} onChange={() => setAlpha(a)} />α ={' '}
                  {a}
                </label>
              ))}
            </div>
            <FTable alpha={alpha} />
          </>
        )}
      </div>
    </div>
  );
}

/** A button that opens the tables in a modal dialog, like the on-screen 付表 in CBT exams. */
export function TablesButton({ className = 'btn btn--quiet btn--sm' }: { className?: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const onClose = () => setOpen(false);
    dialog.addEventListener('close', onClose);
    return () => dialog.removeEventListener('close', onClose);
  }, []);

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={() => {
          setOpen(true);
          ref.current?.showModal();
        }}
      >
        <Table2 size={15} aria-hidden="true" /> {t.tools.tables.short}
      </button>
      <dialog ref={ref} className={s.dialog} aria-label={t.tools.tables.title}>
        <div className={s.dialogHead}>
          <h2>{t.tools.tables.title}</h2>
          <button
            type="button"
            className="btn btn--quiet btn--sm"
            onClick={() => ref.current?.close()}
            aria-label={t.common.close}
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
        {open && <TablesPanel />}
      </dialog>
    </>
  );
}
