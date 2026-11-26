import type { JournalEntry, JournalLine, Question, Response, SelfGrade } from './question';

export interface Grade {
  /** null = cannot be auto-graded yet (essay waiting for self-assessment). */
  correct: boolean | null;
  /** Points earned, 0 … question.points. */
  score: number;
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
    .replace(/[,，\s]/g, '');

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
    case 'essay':
      return response.text.trim() !== '';
  }
}
