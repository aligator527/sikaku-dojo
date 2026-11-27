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

describe('table questions', () => {
  const question: Question = {
    ...base,
    id: 'test/o-table',
    points: 10,
    format: 'table',
    accounts: ['現金', '売掛金', '当期純利益'],
    tables: [
      {
        head: [
          [
            { html: '勘定科目', span: 1 },
            { html: '借方', span: 1 },
            { html: '貸方', span: 1 },
          ],
        ],
        rows: [
          [
            { kind: 'text', html: '現金' },
            { kind: 'input', answer: 1200 },
            { kind: 'input', answer: null },
          ],
          [
            { kind: 'input', answer: ['売掛金'] },
            { kind: 'input', answer: null },
            { kind: 'input', answer: -300 },
          ],
          [
            { kind: 'input', answer: ['当期純利益', '当期純損失'] },
            { kind: 'text', html: '' },
            { kind: 'input', answer: 5000 },
          ],
        ],
      },
    ],
  };
  const answer = (values: Record<string, string>) => grade(question, { format: 'table', values });
  const all = {
    '0-0-1': '1,200',
    '0-1-0': '売掛金',
    '0-1-2': '△300',
    '0-2-0': '当期純損失',
    '0-2-2': '５，０００',
  };

  it('gives full marks when every scored box is right and the empty boxes are empty', () => {
    expect(answer(all)).toEqual({ correct: true, score: 10, cells: { correct: 5, total: 5 } });
  });

  it('gives partial credit per box', () => {
    expect(answer({ ...all, '0-0-1': '1,300', '0-1-0': '現金' })).toEqual({
      correct: false,
      score: 6,
      cells: { correct: 3, total: 5 },
    });
  });

  it('withholds full marks when a box that should stay empty is filled', () => {
    const g = answer({ ...all, '0-0-2': '100' });
    expect(g.correct).toBe(false);
    expect(g.score).toBe(10);
  });

  it('counts a table as answered once anything is typed', () => {
    expect(isAnswered({ format: 'table', values: {} })).toBe(false);
    expect(isAnswered({ format: 'table', values: { '0-0-1': ' ' } })).toBe(false);
    expect(isAnswered({ format: 'table', values: { '0-0-1': '1' } })).toBe(true);
  });

  it('reads △ and ▲ as minus signs', () => {
    expect(parseNumericInput('△1,000')).toBe(-1000);
    expect(parseNumericInput('▲25')).toBe(-25);
  });
});

describe('boxes behind a printed △', () => {
  const question: Question = {
    ...base,
    id: 'test/o-prefix',
    points: 2,
    format: 'table',
    tables: [
      {
        head: [],
        rows: [
          [
            { kind: 'text', html: '貸倒引当金' },
            { kind: 'input', answer: 8000, prefix: '△' },
          ],
        ],
      },
    ],
  };
  it.each(['8000', '8,000', '△8,000', '-8000'])('accepts %s', (v) => {
    expect(grade(question, { format: 'table', values: { '0-0-1': v } }).correct).toBe(true);
  });
});
