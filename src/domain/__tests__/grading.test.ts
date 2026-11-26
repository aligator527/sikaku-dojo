import { describe, expect, it } from 'vitest';

import { grade, isAnswered, journalMatches, parseNumericInput } from '../grading';
import type { Question } from '../question';

const base = {
  slug: 'o-001',
  exam: 'test',
  topics: ['t'],
  difficulty: 2 as const,
  points: 4,
  order: 0,
  source: { kind: 'original' as const },
  stemHtml: '',
  explanationHtml: '',
};

describe('parseNumericInput', () => {
  it.each([
    ['0.25', 0.25],
    ['０．２５', 0.25],
    ['1,200', 1200],
    ['１，２００', 1200],
    ['−3', -3],
    ['1/4', 0.25],
    ['25%', 0.25],
    ['.5', 0.5],
    ['1e-3', 0.001],
    [' 7 ', 7],
  ])('parses %s', (raw, expected) => {
    expect(parseNumericInput(raw)).toBeCloseTo(expected);
  });

  it.each(['', 'abc', '1/0', '1..2', '--1'])('rejects %s', (raw) => {
    expect(parseNumericInput(raw)).toBeNull();
  });
});

describe('grade', () => {
  it('grades single choice', () => {
    const q: Question = { ...base, id: 'a', format: 'single', choicesHtml: ['a', 'b'], answer: 2 };
    expect(grade(q, { format: 'single', choice: 2 })).toEqual({ correct: true, score: 4 });
    expect(grade(q, { format: 'single', choice: 1 })).toEqual({ correct: false, score: 0 });
  });

  it('grades multiple choice as an exact set', () => {
    const q: Question = {
      ...base,
      id: 'b',
      format: 'multiple',
      choicesHtml: ['a', 'b', 'c'],
      answer: [1, 3],
    };
    expect(grade(q, { format: 'multiple', choices: [3, 1] }).correct).toBe(true);
    expect(grade(q, { format: 'multiple', choices: [1] }).correct).toBe(false);
    expect(grade(q, { format: 'multiple', choices: [1, 2, 3] }).correct).toBe(false);
  });

  it('grades numeric answers within tolerance', () => {
    const q: Question = { ...base, id: 'c', format: 'numeric', answer: { value: 0.3, tolerance: 0.005 } };
    expect(grade(q, { format: 'numeric', value: '0.30' }).correct).toBe(true);
    expect(grade(q, { format: 'numeric', value: '0.304' }).correct).toBe(true);
    expect(grade(q, { format: 'numeric', value: '0.31' }).correct).toBe(false);
    expect(grade(q, { format: 'numeric', value: 'x' }).correct).toBe(false);
  });

  it('reads "23.8%" as 23.8 when the answer unit is percent', () => {
    const q: Question = {
      ...base,
      id: 'p',
      format: 'numeric',
      answer: { value: 23.81, tolerance: 0.01, unit: '%' },
    };
    expect(grade(q, { format: 'numeric', value: '23.81' }).correct).toBe(true);
    expect(grade(q, { format: 'numeric', value: '23.81%' }).correct).toBe(true);
    expect(grade(q, { format: 'numeric', value: '２３．８１％' }).correct).toBe(true);
    const ratio: Question = { ...base, id: 'r', format: 'numeric', answer: { value: 0.25, tolerance: 0 } };
    expect(grade(ratio, { format: 'numeric', value: '25%' }).correct).toBe(true);
  });

  it('treats tolerance 0 as exact but ignores float noise', () => {
    const q: Question = { ...base, id: 'd', format: 'numeric', answer: { value: 0.3, tolerance: 0 } };
    expect(grade(q, { format: 'numeric', value: String(0.1 + 0.2) }).correct).toBe(true);
  });

  it('leaves essays ungraded until self-assessed', () => {
    const q: Question = { ...base, id: 'e', format: 'essay', modelAnswerHtml: '', rubric: [] };
    expect(grade(q, { format: 'essay', text: '...' })).toEqual({ correct: null, score: 0 });
    expect(grade(q, { format: 'essay', text: '...', selfGrade: 'partial' })).toEqual({
      correct: false,
      score: 2,
    });
    expect(grade(q, { format: 'essay', text: '...', selfGrade: 'good' })).toEqual({
      correct: true,
      score: 4,
    });
  });

  it('rejects a response of the wrong format', () => {
    const q: Question = { ...base, id: 'f', format: 'single', choicesHtml: ['a'], answer: 1 };
    expect(() => grade(q, { format: 'numeric', value: '1' })).toThrow();
  });
});

describe('journalMatches', () => {
  const expected = {
    debit: [{ account: '仕入', amount: 300000 }],
    credit: [
      { account: '買掛金', amount: 200000 },
      { account: '現金', amount: 100000 },
    ],
  };

  it('ignores row order and blank rows', () => {
    expect(
      journalMatches(expected, {
        debit: [
          { account: '', amount: 0 },
          { account: '仕入', amount: 300000 },
        ],
        credit: [
          { account: '現金', amount: 100000 },
          { account: '買掛金', amount: 200000 },
        ],
      }),
    ).toBe(true);
  });

  it('accepts one account split across rows', () => {
    expect(
      journalMatches(expected, {
        debit: [
          { account: '仕入', amount: 100000 },
          { account: '仕入', amount: 200000 },
        ],
        credit: expected.credit,
      }),
    ).toBe(true);
  });

  it('rejects swapped sides and wrong amounts', () => {
    expect(journalMatches(expected, { debit: expected.credit, credit: expected.debit })).toBe(false);
    expect(
      journalMatches(expected, { debit: [{ account: '仕入', amount: 300001 }], credit: expected.credit }),
    ).toBe(false);
  });
});

describe('isAnswered', () => {
  it('detects empty responses', () => {
    expect(isAnswered(undefined)).toBe(false);
    expect(isAnswered({ format: 'numeric', value: '  ' })).toBe(false);
    expect(isAnswered({ format: 'multiple', choices: [] })).toBe(false);
    expect(isAnswered({ format: 'single', choice: 1 })).toBe(true);
  });
});
