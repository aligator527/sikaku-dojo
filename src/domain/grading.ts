import {
  tableCellKey,
  type JournalEntry,
  type JournalLine,
  type Question,
  type Response,
  type SelfGrade,
  type TableQuestion,
} from './question';

export interface Grade {
  /** null = cannot be auto-graded yet (essay waiting for self-assessment). */
  correct: boolean | null;
  /** Points earned, 0 … question.points. */
  score: number;
  /** Table questions: scored boxes filled in correctly, out of all scored boxes. */
  cells?: { correct: number; total: number };
}

const FULL_WIDTH_DIGITS = /[０-９]/g;

/**
 * Turns whatever a learner typed into a number:
 * full-width digits, thousands separators, a unicode minus, "1/4" fractions and "%"
 * are all accepted. Returns null when the input is not a number.
 */
export function parseNumericInput(raw: string, options: { percentUnit?: boolean } = {}): number | null {
  const normalized = raw
    .trim()
    .replace(FULL_WIDTH_DIGITS, (d) => String.fromCharCode(d.charCodeAt(0) - 0xfee0))
    .replace(/[．。]/g, '.')
    .replace(/[−ー－–—]/g, '-')
    .replace(/[／]/g, '/')
    .replace(/[,，\s]/g, '')
    // 財務諸表 write negatives as △1,000 (or ▲1,000).
    .replace(/^[△▲]/, '-');

  if (normalized === '') return null;

  const fraction = /^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/.exec(normalized);
  if (fraction) {
    const den = Number(fraction[2]);
    return den === 0 ? null : Number(fraction[1]) / den;
  }

  const percent = /^(-?\d*\.?\d+)[%％]$/.exec(normalized);
  // When the answer itself is in percent (unit "%"), "23.8%" means 23.8, not 0.238.
  if (percent) return Number(percent[1]) / (options.percentUnit ? 1 : 100);

  return /^-?(\d+\.?\d*|\.\d+)(e-?\d+)?$/i.test(normalized) ? Number(normalized) : null;
}

/** Sums amounts per account, dropping blank rows, so row order and splitting do not matter. */
export function totalsByAccount(lines: JournalLine[]): Map<string, number> {
  const totals = new Map<string, number>();
  for (const { account, amount } of lines) {
    const name = account.trim();
    if (!name || !Number.isFinite(amount) || amount === 0) continue;
    totals.set(name, (totals.get(name) ?? 0) + amount);
  }
  return totals;
}

function sameTotals(a: Map<string, number>, b: Map<string, number>): boolean {
  if (a.size !== b.size) return false;
  for (const [account, amount] of a) {
    if (Math.abs((b.get(account) ?? Number.NaN) - amount) > 1e-6) return false;
  }
  return true;
}

export function journalMatches(expected: JournalEntry, actual: JournalEntry): boolean {
  return (
    sameTotals(totalsByAccount(expected.debit), totalsByAccount(actual.debit)) &&
    sameTotals(totalsByAccount(expected.credit), totalsByAccount(actual.credit))
  );
}

const normalizeText = (s: string) => s.normalize('NFKC').replace(/\s+/g, '');

/**
 * Whether each box of a table question is right: true / false for scored boxes, and for boxes
 * that must stay empty, false when something was written in them (null when left empty).
 */
export function tableCellResults(
  question: TableQuestion,
  values: Record<string, string>,
): Map<string, boolean | null> {
  const results = new Map<string, boolean | null>();
  question.tables.forEach((table, ti) =>
    table.rows.forEach((row, ri) =>
      row.forEach((cell, ci) => {
        if (cell.kind !== 'input') return;
        const key = tableCellKey(ti, ri, ci);
        const raw = (values[key] ?? '').trim();
        const { answer } = cell;
        if (answer === null) results.set(key, raw === '' ? null : false);
        else if (typeof answer === 'number') {
          let n = parseNumericInput(raw);
          // Behind a printed △ the amount is typed as is; "△8,000" there means the same.
          if (n !== null && n < 0 && cell.prefix === '△') n = -n;
          results.set(key, n !== null && Math.abs(n - answer) <= (cell.tolerance ?? 0) + 1e-9);
        } else
          results.set(
            key,
            answer.some((a) => normalizeText(a) === normalizeText(raw)),
          );
      }),
    ),
  );
  return results;
}

/** Scored boxes and how many of them are right. */
export function tableTally(question: TableQuestion, values: Record<string, string>) {
  let correct = 0;
  let total = 0;
  let strayFilled = 0;
  const results = tableCellResults(question, values);
  question.tables.forEach((table, ti) =>
    table.rows.forEach((row, ri) =>
      row.forEach((cell, ci) => {
        if (cell.kind !== 'input') return;
        const ok = results.get(tableCellKey(ti, ri, ci));
        if (cell.answer === null) {
          if (ok === false) strayFilled += 1;
          return;
        }
        total += 1;
        if (ok) correct += 1;
      }),
    ),
  );
  return { correct, total, strayFilled };
}

const SELF_GRADE_RATIO: Record<SelfGrade, number> = { good: 1, partial: 0.5, poor: 0 };

export function grade(question: Question, response: Response): Grade {
  if (question.format !== response.format) {
    throw new Error(`response format ${response.format} does not match question ${question.id}`);
  }
  const full = (ok: boolean): Grade => ({ correct: ok, score: ok ? question.points : 0 });

  switch (question.format) {
    case 'single':
      return full((response as Extract<Response, { format: 'single' }>).choice === question.answer);

    case 'multiple': {
      const chosen = new Set((response as Extract<Response, { format: 'multiple' }>).choices);
      const expected = new Set(question.answer);
      return full(chosen.size === expected.size && [...expected].every((c) => chosen.has(c)));
    }

    case 'numeric': {
      const unit = question.answer.unit?.trim();
      const value = parseNumericInput((response as Extract<Response, { format: 'numeric' }>).value, {
        percentUnit: unit === '%' || unit === '％',
      });
      if (value === null) return full(false);
      // A tiny epsilon absorbs binary floating point noise (0.1 + 0.2 ≠ 0.3).
      return full(Math.abs(value - question.answer.value) <= question.answer.tolerance + 1e-9);
    }

    case 'journal':
      return full(
        journalMatches(question.answer, (response as Extract<Response, { format: 'journal' }>).entry),
      );

    case 'table': {
      // Partial credit per box, as in the 簿記 exams. Full marks also need the empty boxes empty.
      const { correct, total, strayFilled } = tableTally(
        question,
        (response as Extract<Response, { format: 'table' }>).values,
      );
      const ratio = total > 0 ? correct / total : 0;
      return {
        correct: correct === total && strayFilled === 0,
        score: Math.round(question.points * ratio * 100) / 100,
        cells: { correct, total },
      };
    }

    case 'essay': {
      const { selfGrade } = response as Extract<Response, { format: 'essay' }>;
      if (!selfGrade) return { correct: null, score: 0 };
      return { correct: selfGrade === 'good', score: question.points * SELF_GRADE_RATIO[selfGrade] };
    }
  }
}

/** True when the learner has given enough input to submit. */
export function isAnswered(response: Response | undefined): boolean {
  if (!response) return false;
  switch (response.format) {
    case 'single':
      return response.choice > 0;
    case 'multiple':
      return response.choices.length > 0;
    case 'numeric':
      return response.value.trim() !== '';
    case 'journal':
      return response.entry.debit.some((l) => l.account) && response.entry.credit.some((l) => l.account);
    case 'table':
      return Object.values(response.values).some((v) => v.trim() !== '');
    case 'essay':
      return response.text.trim() !== '';
  }
}
