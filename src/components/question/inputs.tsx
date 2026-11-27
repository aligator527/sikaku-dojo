/**
 * Answer inputs, one per question format. They are controlled components:
 * the parent owns the Response and decides when answers are locked or revealed.
 */
import { Circle, Minus, Plus, X } from 'lucide-react';
import { useId, useRef, type KeyboardEvent } from 'react';

import type { ChoiceStyle } from '../../config/catalog';
import { choiceLabel } from '../../domain/labels';
import { tableCellResults } from '../../domain/grading';
import {
  tableCellKey,
  type AnswerTable,
  type JournalEntry,
  type JournalLine,
  type Question,
  type Response,
  type TableCell,
} from '../../domain/question';
import { t } from '../../i18n';
import s from './Question.module.css';

export function emptyResponse(q: Question): Response {
  switch (q.format) {
    case 'single':
      return { format: 'single', choice: 0 };
    case 'multiple':
      return { format: 'multiple', choices: [] };
    case 'numeric':
      return { format: 'numeric', value: '' };
    case 'journal':
      return {
        format: 'journal',
        entry: { debit: [{ account: '', amount: 0 }], credit: [{ account: '', amount: 0 }] },
      };
    case 'table':
      return { format: 'table', values: {} };
    case 'essay':
      return { format: 'essay', text: '' };
  }
}

/**
 * The response after pressing choice n on the keyboard (1-based), or null when the question
 * has no choices. Single choice selects; multiple choice toggles.
 */
export function pressChoice(q: Question, r: Response, n: number): Response | null {
  if (q.format === 'single') return n <= q.choicesHtml.length ? { format: 'single', choice: n } : null;
  if (q.format !== 'multiple' || r.format !== 'multiple' || n > q.choicesHtml.length) return null;
  const next = new Set(r.choices);
  if (next.has(n)) next.delete(n);
  else next.add(n);
  return { format: 'multiple', choices: [...next].sort((a, b) => a - b) };
}

interface InputProps {
  question: Question;
  response: Response;
  onChange: (r: Response) => void;
  choiceStyle: ChoiceStyle;
  /** Inputs are read-only (after grading, or in review). */
  locked?: boolean;
  /** Show ◯ / × marks against the answer key. */
  reveal?: boolean;
}

export function AnswerInput(props: InputProps) {
  const { question } = props;
  switch (question.format) {
    case 'single':
    case 'multiple':
      return <ChoiceList {...props} question={question} />;
    case 'numeric':
      return <NumericField {...props} question={question} />;
    case 'journal':
      return <JournalField {...props} question={question} />;
    case 'table':
      return <TableField {...props} question={question} />;
    case 'essay':
      return <EssayField {...props} question={question} />;
  }
}

/* ------------------------------------------------------------------ */

function ChoiceList({
  question,
  response,
  onChange,
  choiceStyle,
  locked,
  reveal,
}: InputProps & { question: Extract<Question, { format: 'single' | 'multiple' }> }) {
  const name = useId();
  const multiple = question.format === 'multiple';
  const selected = new Set(
    response.format === 'single' ? [response.choice] : response.format === 'multiple' ? response.choices : [],
  );
  const correct = new Set(question.format === 'single' ? [question.answer] : question.answer);

  const toggle = (n: number) => {
    if (locked) return;
    if (!multiple) return onChange({ format: 'single', choice: n });
    const next = new Set(selected);
    if (next.has(n)) next.delete(n);
    else next.add(n);
    onChange({ format: 'multiple', choices: [...next].sort((a, b) => a - b) });
  };

  return (
    <ul className={s.choices} role={multiple ? 'group' : 'radiogroup'}>
      {question.choicesHtml.map((html, i) => {
        const n = i + 1;
        const isAnswer = correct.has(n);
        const isChosen = selected.has(n);
        const state = reveal ? (isAnswer ? s.isCorrect : isChosen ? s.isWrong : '') : '';
        return (
          <li key={n}>
            <label className={[s.choice, locked ? s.locked : '', state].join(' ')}>
              <input
                type={multiple ? 'checkbox' : 'radio'}
                name={name}
                checked={isChosen}
                disabled={locked}
                onChange={() => toggle(n)}
              />
              <span className={s.choiceLabel} aria-hidden="true">
                {choiceLabel(choiceStyle, n)}
              </span>
              <span className="visually-hidden">{choiceLabel(choiceStyle, n)}：</span>
              <span className={s.choiceText} dangerouslySetInnerHTML={{ __html: html }} />
              <span className={s.choiceMark}>
                {reveal && isAnswer && (
                  <Circle size={22} strokeWidth={2.6} className={s.markOk} aria-label={t.question.correct} />
                )}
                {reveal && isChosen && !isAnswer && (
                  <X size={22} strokeWidth={2.6} className={s.markNg} aria-label={t.question.incorrect} />
                )}
              </span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}

/* ------------------------------------------------------------------ */

function NumericField({
  question,
  response,
  onChange,
  locked,
}: InputProps & { question: Extract<Question, { format: 'numeric' }> }) {
  const id = useId();
  const value = response.format === 'numeric' ? response.value : '';
  return (
    <div className={s.numeric}>
      <label htmlFor={id} className="visually-hidden">
        {t.question.numericPlaceholder}
      </label>
      <input
        id={id}
        className="input"
        inputMode="decimal"
        autoComplete="off"
        placeholder={t.question.numericPlaceholder}
        value={value}
        readOnly={locked}
        onChange={(e) => onChange({ format: 'numeric', value: e.target.value })}
      />
      {question.answer.unit && <span>{question.answer.unit}</span>}
      {question.inputHint && <p className={s.hint}>{question.inputHint}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */

const yen = (n: number) => n.toLocaleString('ja-JP');

function JournalField({
  question,
  response,
  onChange,
  locked,
}: InputProps & { question: Extract<Question, { format: 'journal' }> }) {
  const entry = response.format === 'journal' ? response.entry : { debit: [], credit: [] };
  const set = (side: keyof JournalEntry, lines: JournalLine[]) =>
    onChange({ format: 'journal', entry: { ...entry, [side]: lines } });

  const side = (key: keyof JournalEntry, title: string) => {
    const lines = entry[key];
    const total = lines.reduce((sum, l) => sum + (Number.isFinite(l.amount) ? l.amount : 0), 0);
    return (
      <section className={s.journalSide} aria-label={title}>
        <h4>{title}</h4>
        {lines.map((line, i) => (
          <div className={s.journalRow} key={i}>
            <select
              className="select"
              aria-label={`${title} ${i + 1}行目 ${t.question.journal.account}`}
              value={line.account}
              disabled={locked}
              onChange={(e) =>
                set(
                  key,
                  lines.map((l, j) => (j === i ? { ...l, account: e.target.value } : l)),
                )
              }
            >
              <option value="">{t.question.journal.choose}</option>
              {question.accounts.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
            <input
              className="input"
              inputMode="numeric"
              aria-label={`${title} ${i + 1}行目 ${t.question.journal.amount}`}
              value={line.amount ? yen(line.amount) : ''}
              readOnly={locked}
              onChange={(e) => {
                const n = Number(e.target.value.replace(/[^\d]/g, ''));
                set(
                  key,
                  lines.map((l, j) => (j === i ? { ...l, amount: n } : l)),
                );
              }}
            />
            <button
              type="button"
              className={s.iconButton}
              aria-label={t.question.journal.removeRow}
              disabled={locked || lines.length === 1}
              onClick={() =>
                set(
                  key,
                  lines.filter((_, j) => j !== i),
                )
              }
            >
              <Minus size={16} />
            </button>
          </div>
        ))}
        <div className={s.journalFoot}>
          <button
            type="button"
            className="btn btn--quiet btn--sm"
            disabled={locked || lines.length >= 6}
            onClick={() => set(key, [...lines, { account: '', amount: 0 }])}
          >
            <Plus size={14} /> {t.question.journal.addRow}
          </button>
          <span className="num">
            {t.question.journal.total} {yen(total)}
          </span>
        </div>
      </section>
    );
  };

  return (
    <div className={s.journal}>
      {side('debit', t.question.journal.debit)}
      {side('credit', t.question.journal.credit)}
    </div>
  );
}

/** The correct 仕訳 as a two-sided table. */
export function JournalTable({ entry }: { entry: JournalEntry }) {
  const rows = Math.max(entry.debit.length, entry.credit.length);
  return (
    <table className={s.journalTable}>
      <thead>
        <tr>
          <th colSpan={2}>{t.question.journal.debit}</th>
          <th colSpan={2}>{t.question.journal.credit}</th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }, (_, i) => (
          <tr key={i}>
            <td>{entry.debit[i]?.account}</td>
            <td className={s.amount}>{entry.debit[i] ? yen(entry.debit[i]!.amount) : ''}</td>
            <td>{entry.credit[i]?.account}</td>
            <td className={s.amount}>{entry.credit[i] ? yen(entry.credit[i]!.amount) : ''}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ------------------------------------------------------------------ */

const plain = (html: string) => html.replace(/<[^>]+>/g, '').trim();

/** "残高試算表 借方" for each column: the header rows' labels with their spans expanded. */
function columnLabels(table: AnswerTable): string[] {
  const width = table.rows[0]?.length ?? 0;
  const labels: string[][] = Array.from({ length: width }, () => []);
  for (const row of table.head) {
    let col = 0;
    for (const cell of row) {
      for (let k = 0; k < cell.span && col < width; k += 1, col += 1) {
        const text = plain(cell.html);
        if (text) labels[col]!.push(text);
      }
    }
  }
  return labels.map((l) => l.join(' '));
}

/** The answer of one box as printed in the key: 1,200 / △300 / 売掛金 / （空欄）. */
export function boxAnswerText(cell: Extract<TableCell, { kind: 'input' }>): string {
  if (cell.answer === null) return `（${t.question.table.shouldBeEmpty}）`;
  if (typeof cell.answer === 'number') return cell.answer < 0 ? `△${yen(-cell.answer)}` : yen(cell.answer);
  return cell.answer[0]!;
}

function TableHead({ table }: { table: AnswerTable }) {
  if (table.head.length === 0) return null;
  return (
    <thead>
      {table.head.map((row, i) => (
        <tr key={i}>
          {row.map((cell, j) => (
            <th
              key={j}
              colSpan={cell.span > 1 ? cell.span : undefined}
              dangerouslySetInnerHTML={{ __html: cell.html }}
            />
          ))}
        </tr>
      ))}
    </thead>
  );
}

function TableField({
  question,
  response,
  onChange,
  locked,
  reveal,
}: InputProps & { question: Extract<Question, { format: 'table' }> }) {
  const values = response.format === 'table' ? response.values : {};
  const results = reveal ? tableCellResults(question, values) : null;
  const root = useRef<HTMLDivElement>(null);
  const set = (key: string, value: string) =>
    onChange({ format: 'table', values: { ...values, [key]: value } });

  // Enter moves to the next box, like a spreadsheet (it never submits from inside the table).
  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key !== 'Enter' || e.nativeEvent.isComposing) return;
    e.preventDefault();
    const boxes = [...(root.current?.querySelectorAll<HTMLElement>('input, select') ?? [])];
    const next = boxes[boxes.indexOf(e.currentTarget) + 1];
    next?.focus();
  };

  return (
    <div className={s.tableField} ref={root}>
      {!locked && <p className={s.hint}>{t.question.table.enterHint}</p>}
      {question.tables.map((table, ti) => {
        const columns = columnLabels(table);
        // Columns that take names (勘定科目・摘要). A box that must stay empty gets the same
        // control as its column, so the kind of box never gives away where the answer goes.
        const textColumns = new Set([
          ...table.rows.flatMap((row) =>
            row.flatMap((c, ci) => (c.kind === 'input' && Array.isArray(c.answer) ? [ci] : [])),
          ),
          ...columns.flatMap((label, ci) => (/摘要|科目|語句/.test(label) ? [ci] : [])),
        ]);
        return (
          <div className={s.tableScroll} key={ti}>
            <table className={s.answerTable}>
              {table.captionHtml && <caption dangerouslySetInnerHTML={{ __html: table.captionHtml }} />}
              <TableHead table={table} />
              <tbody>
                {table.rows.map((row, ri) => {
                  // A box is named after the nearest printed label to its left (勘定科目, or the
                  // date of a T-account side) and its column header: "現金 修正記入 借方".
                  const rowLabelAt = (ci: number) => {
                    for (let k = ci - 1; k >= 0; k -= 1) {
                      const c = row[k]!;
                      if (c.kind === 'text' && !c.numeric && plain(c.html)) return plain(c.html);
                    }
                    return '';
                  };
                  return (
                    <tr key={ri}>
                      {row.map((cell, ci) => {
                        if (cell.kind === 'text')
                          return (
                            <td
                              key={ci}
                              className={cell.numeric ? s.amount : undefined}
                              dangerouslySetInnerHTML={{ __html: cell.html }}
                            />
                          );
                        const key = tableCellKey(ti, ri, ci);
                        const ok = results?.get(key);
                        const label =
                          [rowLabelAt(ci), columns[ci]].filter(Boolean).join(' ') ||
                          `${ri + 1}行目 ${ci + 1}列目`;
                        const text =
                          Array.isArray(cell.answer) || (cell.answer === null && textColumns.has(ci));
                        return (
                          <td
                            key={ci}
                            className={[s.box, ok === true ? s.boxOk : '', ok === false ? s.boxNg : ''].join(
                              ' ',
                            )}
                          >
                            {cell.prefix && <span className={s.boxPrefix}>{cell.prefix}</span>}
                            {text && question.accounts ? (
                              <select
                                className="select"
                                aria-label={label}
                                value={values[key] ?? ''}
                                disabled={locked}
                                onChange={(e) => set(key, e.target.value)}
                                onKeyDown={onKeyDown}
                              >
                                <option value="">{t.question.table.choose}</option>
                                {question.accounts.map((a) => (
                                  <option key={a} value={a}>
                                    {a}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <input
                                className={`input ${text ? '' : s.amount}`}
                                inputMode={text ? 'text' : 'decimal'}
                                autoComplete="off"
                                aria-label={label}
                                value={values[key] ?? ''}
                                readOnly={locked}
                                onChange={(e) => set(key, e.target.value)}
                                onKeyDown={onKeyDown}
                              />
                            )}
                            {ok === false && (
                              <span className={s.boxFix}>
                                {t.question.table.correctIs} {boxAnswerText(cell)}
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}

/** The filled-in tables, for the answer key in the explanation. */
export function AnswerTables({ question }: { question: Extract<Question, { format: 'table' }> }) {
  return (
    <div className={s.tableField}>
      {question.tables.map((table, ti) => (
        <div className={s.tableScroll} key={ti}>
          <table className={s.answerTable}>
            {table.captionHtml && <caption dangerouslySetInnerHTML={{ __html: table.captionHtml }} />}
            <TableHead table={table} />
            <tbody>
              {table.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) =>
                    cell.kind === 'text' ? (
                      <td
                        key={ci}
                        className={cell.numeric ? s.amount : undefined}
                        dangerouslySetInnerHTML={{ __html: cell.html }}
                      />
                    ) : (
                      <td
                        key={ci}
                        className={[s.keyBox, typeof cell.answer === 'number' ? s.amount : ''].join(' ')}
                      >
                        {cell.answer === null ? '' : `${cell.prefix ?? ''}${boxAnswerText(cell)}`}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function EssayField({
  question,
  response,
  onChange,
  locked,
}: InputProps & { question: Extract<Question, { format: 'essay' }> }) {
  const text = response.format === 'essay' ? response.text : '';
  const length = [...text.replace(/\s/g, '')].length;
  const over = question.charLimit !== undefined && length > question.charLimit;
  return (
    <div className={s.essay}>
      <textarea
        aria-label={t.question.essayPlaceholder}
        placeholder={t.question.essayPlaceholder}
        value={text}
        readOnly={locked}
        onChange={(e) =>
          onChange({
            format: 'essay',
            text: e.target.value,
            selfGrade: response.format === 'essay' ? response.selfGrade : undefined,
          })
        }
      />
      <p className={[s.charCount, over ? s.overLimit : ''].join(' ')}>
        {t.question.chars(length, question.charLimit)}
      </p>
    </div>
  );
}
