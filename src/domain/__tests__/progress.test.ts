import { describe, expect, it } from 'vitest';

import {
  addDays,
  currentStreak,
  daysBetween,
  dueCards,
  dueReviews,
  longestStreak,
  upcomingReviews,
  emptyProgress,
  mergeProgress,
  parseProgress,
  recordAttempt,
  reviewCard,
  summarize,
  summarizeByTopic,
  toggleBookmark,
  weakestTopics,
} from '../progress';

const T1 = '2026-11-01T10:00:00.000Z';
const T2 = '2026-11-02T10:00:00.000Z';

describe('attempts', () => {
  it('accumulates attempts and streaks', () => {
    let s = emptyProgress();
    s = recordAttempt(s, 'q1', 'correct', T1);
    s = recordAttempt(s, 'q1', 'correct', T2);
    expect(s.attempts.q1).toMatchObject({ attempts: 2, correct: 2, streak: 2, last: 'correct' });
    s = recordAttempt(s, 'q1', 'incorrect', T2);
    expect(s.attempts.q1).toMatchObject({ attempts: 3, correct: 2, streak: 0, last: 'incorrect' });
  });

  it('summarises a set of questions', () => {
    let s = emptyProgress();
    s = recordAttempt(s, 'q1', 'correct', T1);
    s = recordAttempt(s, 'q2', 'incorrect', T1);
    const sum = summarize(s, ['q1', 'q2', 'q3']);
    expect(sum).toMatchObject({ total: 3, answered: 2, lastCorrect: 1, accuracy: 0.5 });
    expect(summarize(s, ['q9']).accuracy).toBeNull();
  });

  it('finds weak topics', () => {
    let s = emptyProgress();
    for (const id of ['a1', 'a2']) s = recordAttempt(s, id, 'incorrect', T1);
    for (const id of ['b1', 'b2']) s = recordAttempt(s, id, 'correct', T1);
    const byTopic = summarizeByTopic(s, [
      { id: 'a1', topics: ['a'] },
      { id: 'a2', topics: ['a'] },
      { id: 'b1', topics: ['b'] },
      { id: 'b2', topics: ['b'] },
    ]);
    expect(weakestTopics(byTopic)).toEqual(['a']);
  });
});

describe('bookmarks', () => {
  it('toggles', () => {
    let s = toggleBookmark(emptyProgress(), 'q1', T1);
    expect(s.bookmarks.q1).toBe(T1);
    s = toggleBookmark(s, 'q1', T2);
    expect(s.bookmarks.q1).toBeUndefined();
  });
});

describe('flashcards', () => {
  it('moves cards through Leitner boxes', () => {
    let s = reviewCard(emptyProgress(), 't', true, '2026-11-01');
    expect(s.cards.t).toMatchObject({ box: 1, due: '2026-11-02' });
    s = reviewCard(s, 't', true, '2026-11-02');
    expect(s.cards.t).toMatchObject({ box: 2, due: '2026-11-04' });
    s = reviewCard(s, 't', false, '2026-11-04');
    expect(s.cards.t).toMatchObject({ box: 1, due: '2026-11-04' });
    expect(dueCards(s, ['t', 'new'], '2026-11-04')).toEqual(['t', 'new']);
  });
});

describe('parse & merge', () => {
  it('drops malformed records instead of failing', () => {
    const s = parseProgress({
      attempts: { ok: { attempts: 1, correct: 1, lastAt: T1 }, bad: 3 },
      mocks: 'x',
    });
    expect(Object.keys(s.attempts)).toEqual(['ok']);
    expect(s.mocks).toEqual([]);
    expect(parseProgress(null)).toEqual(emptyProgress());
  });

  it('keeps the most recent record when merging', () => {
    const a = recordAttempt(emptyProgress(), 'q', 'incorrect', T1);
    const b = recordAttempt(emptyProgress(), 'q', 'correct', T2);
    expect(mergeProgress(a, b).attempts.q?.last).toBe('correct');
    expect(mergeProgress(b, a).attempts.q?.last).toBe('correct');
  });
});

describe('dates', () => {
  it('adds days across month boundaries', () => {
    expect(addDays('2026-11-30', 1)).toBe('2026-12-01');
    expect(daysBetween('2026-11-26', '2027-01-01')).toBe(36);
  });
});

describe('question review schedule', () => {
  const at = (day: string) => `${day}T09:00:00.000Z`;

  it('schedules a missed question for tomorrow and widens the interval on time', () => {
    let s = recordAttempt(emptyProgress(), 'q', 'incorrect', at('2026-11-01'), '2026-11-01');
    expect(s.attempts.q!.review).toEqual({ stage: 0, due: '2026-11-02' });
    s = recordAttempt(s, 'q', 'correct', at('2026-11-02'), '2026-11-02');
    expect(s.attempts.q!.review).toEqual({ stage: 1, due: '2026-11-05' });
    s = recordAttempt(s, 'q', 'correct', at('2026-11-05'), '2026-11-05');
    expect(s.attempts.q!.review).toEqual({ stage: 2, due: '2026-11-12' });
  });

  it('ignores an early correct answer and restarts after another miss', () => {
    let s = recordAttempt(emptyProgress(), 'q', 'incorrect', at('2026-11-01'), '2026-11-01');
    s = recordAttempt(s, 'q', 'correct', at('2026-11-01'), '2026-11-01'); // immediate retry
    expect(s.attempts.q!.review).toEqual({ stage: 0, due: '2026-11-02' });
    s = recordAttempt(s, 'q', 'partial', at('2026-11-02'), '2026-11-02');
    expect(s.attempts.q!.review).toEqual({ stage: 0, due: '2026-11-03' });
  });

  it('graduates after the last stage and never queues first-time correct answers', () => {
    let s = recordAttempt(emptyProgress(), 'q', 'incorrect', at('2026-11-01'), '2026-11-01');
    let day = '2026-11-01';
    for (const gap of [1, 3, 7, 14, 30]) {
      day = addDays(day, gap);
      s = recordAttempt(s, 'q', 'correct', at(day), day);
    }
    expect(s.attempts.q!.review).toBeUndefined();
    s = recordAttempt(s, 'r', 'correct', at(day), day);
    expect(s.attempts.r!.review).toBeUndefined();
  });

  it('lists due and upcoming reviews', () => {
    let s = recordAttempt(emptyProgress(), 'a', 'incorrect', at('2026-11-01'), '2026-11-01');
    s = recordAttempt(s, 'b', 'incorrect', at('2026-11-03'), '2026-11-03');
    expect(dueReviews(s, ['a', 'b', 'c'], '2026-11-03')).toEqual(['a']);
    expect(upcomingReviews(s, ['a', 'b'], '2026-11-03', 3)).toEqual([1, 0, 0]);
  });
});

describe('activity and streaks', () => {
  it('counts answers and cards per day', () => {
    let s = recordAttempt(emptyProgress(), 'q1', 'correct', 'x', '2026-11-01');
    s = recordAttempt(s, 'q2', 'incorrect', 'x', '2026-11-01');
    s = reviewCard(s, 't', true, '2026-11-02');
    expect(s.activity['2026-11-01']).toEqual({ answered: 2, correct: 1, cards: 0 });
    expect(s.activity['2026-11-02']).toEqual({ answered: 0, correct: 0, cards: 1 });
  });

  it('measures the current and longest streak', () => {
    let s = emptyProgress();
    for (const d of ['2026-10-01', '2026-10-02', '2026-10-03', '2026-11-04', '2026-11-05'])
      s = recordAttempt(s, d, 'correct', 'x', d);
    expect(currentStreak(s, '2026-11-05')).toBe(2);
    expect(currentStreak(s, '2026-11-06')).toBe(2); // today not studied yet
    expect(currentStreak(s, '2026-11-07')).toBe(0);
    expect(longestStreak(s)).toBe(3);
  });

  it('merges activity without double counting and survives parsing', () => {
    const a = recordAttempt(emptyProgress(), 'q', 'correct', 'x', '2026-11-01');
    const merged = mergeProgress(a, parseProgress(JSON.parse(JSON.stringify(a))));
    expect(merged.activity['2026-11-01']!.answered).toBe(1);
    const parsed = parseProgress({
      attempts: { q: { attempts: 1, correct: 0, lastAt: 'x', review: 'bad' } },
    });
    expect(parsed.attempts.q).toBeDefined();
    expect(parsed.attempts.q!.review).toBeUndefined();
    expect(parseProgress({ activity: { d: { answered: 3, correct: 1 } } }).activity.d).toEqual({
      answered: 3,
      correct: 1,
      cards: 0,
    });
  });
});
