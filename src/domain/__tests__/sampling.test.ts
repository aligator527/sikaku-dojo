import { describe, expect, it } from 'vitest';

import { createRng, drawFromBlueprint, hashSeed, pickDaily, shuffle } from '../sampling';

const pool = [
  { id: 'a', topics: ['x'] },
  { id: 'b', topics: ['x'] },
  { id: 'c', topics: ['y'] },
  { id: 'd', topics: ['y', 'x'] },
  { id: 'e', topics: ['z'] },
];

describe('rng', () => {
  it('is deterministic per seed', () => {
    const a = createRng(42);
    const b = createRng(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it('shuffle keeps every element', () => {
    const out = shuffle([1, 2, 3, 4, 5], createRng(1));
    expect([...out].sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it('hashSeed is stable', () => {
    expect(hashSeed('2026-11-26')).toBe(hashSeed('2026-11-26'));
    expect(hashSeed('a')).not.toBe(hashSeed('b'));
  });
});

describe('drawFromBlueprint', () => {
  it('respects topics, counts and never repeats a question', () => {
    const drawn = drawFromBlueprint(pool, [{ topics: ['y'], count: 2 }, { count: 10 }], createRng(7));
    expect(drawn).toHaveLength(5);
    expect(new Set(drawn.map((q) => q.id)).size).toBe(5);
    expect(drawn.slice(0, 2).every((q) => q.topics.includes('y'))).toBe(true);
  });

  it('fills what it can when a row is too large', () => {
    expect(drawFromBlueprint(pool, [{ topics: ['z'], count: 3 }], createRng(1))).toHaveLength(1);
  });
});

describe('pickDaily', () => {
  it('returns the same item for the same day', () => {
    expect(pickDaily(pool, '2026-11-26', 'toukei-2')).toBe(pickDaily(pool, '2026-11-26', 'toukei-2'));
    expect(pickDaily([], '2026-11-26')).toBeUndefined();
  });
});

describe('blueprint sections', () => {
  it('draws only from the listed sections', () => {
    const pool = [
      { id: 'a', topics: ['s'], section: 'am1' },
      { id: 'b', topics: ['s'], section: 'am2' },
      { id: 'c', topics: ['s'] },
    ];
    const picked = drawFromBlueprint(pool, [{ topics: ['s'], sections: ['am2'], count: 3 }], createRng(1));
    expect(picked.map((q) => q.id)).toEqual(['b']);
  });
});

describe('blueprint formats', () => {
  it('draws only the listed formats', () => {
    const pool = [
      { id: 'a', topics: ['s'], format: 'essay' },
      { id: 'b', topics: ['s'], format: 'single' },
    ];
    expect(
      drawFromBlueprint(pool, [{ formats: ['essay'], count: 2 }], createRng(1)).map((q) => q.id),
    ).toEqual(['a']);
  });
});
