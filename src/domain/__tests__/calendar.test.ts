import { describe, expect, it } from 'vitest';

import { calendarWeeks, recentTotals } from '../calendar';
import { emptyProgress, recordAttempt, reviewCard } from '../progress';

describe('study calendar', () => {
  // 2026-11-26 is a Thursday.
  const today = '2026-11-26';

  it('builds Monday-first weeks ending with the current week', () => {
    const weeks = calendarWeeks(emptyProgress(), today, 3);
    expect(weeks).toHaveLength(3);
    expect(weeks[2]![0]!.date).toBe('2026-11-23');
    expect(weeks[2]![6]!.date).toBe('2026-11-29');
    expect(weeks[2]![6]!.future).toBe(true);
    expect(weeks[0]![0]!.date).toBe('2026-11-09');
  });

  it('scales levels to the busiest day', () => {
    let s = emptyProgress();
    for (let i = 0; i < 8; i++) s = recordAttempt(s, `q${i}`, 'correct', 'x', '2026-11-24');
    s = recordAttempt(s, 'a', 'incorrect', 'x', '2026-11-25');
    s = reviewCard(s, 't', true, '2026-11-25');
    const week = calendarWeeks(s, today, 1)[0]!;
    expect(week[1]).toMatchObject({ count: 8, level: 4 });
    expect(week[2]).toMatchObject({ count: 2, answered: 1, cards: 1, level: 1 });
    expect(week[0]!.level).toBe(0);
    expect(recentTotals(s, today, 7)).toEqual({ answered: 9, correct: 8, activeDays: 2 });
  });
});
