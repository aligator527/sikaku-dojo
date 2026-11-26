/**
 * Answer inputs, one per question format. They are controlled components:
 * the parent owns the Response and decides when answers are locked or revealed.
 */
import { Circle, Minus, Plus, X } from 'lucide-react';
import { useId } from 'react';

import type { ChoiceStyle } from '../../config/catalog';
import { choiceLabel } from '../../domain/labels';
import type { JournalEntry, JournalLine, Question, Response } from '../../domain/question';
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
