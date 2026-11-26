/**
 * The study calendar: a weeks × weekdays grid of daily activity, Monday first,
 * ending with the week that contains `today`.
 */
import { addDays, type ProgressState } from './progress';

export interface CalendarDay {
  date: string;
  /** Questions answered plus flashcards reviewed. */
  count: number;
  answered: number;
  cards: number;
  /** 0 = none … 4 = busiest, relative to the learner's own busiest day in the range. */
  level: 0 | 1 | 2 | 3 | 4;
  future: boolean;
}

/** 0 = Monday … 6 = Sunday */
const weekday = (dateKey: string) => {
  const [y, m, d] = dateKey.split('-').map(Number);
  return (new Date(y!, m! - 1, d!).getDay() + 6) % 7;
};

export function calendarWeeks(state: ProgressState, today: string, weeks: number): CalendarDay[][] {
  const lastMonday = addDays(today, -weekday(today));
  const first = addDays(lastMonday, -7 * (weeks - 1));
  const days: Omit<CalendarDay, 'level'>[] = [];
  for (let i = 0; i < weeks * 7; i++) {
    const date = addDays(first, i);
    const a = state.activity[date];
    const answered = a?.answered ?? 0;
    const cards = a?.cards ?? 0;
    days.push({ date, answered, cards, count: answered + cards, future: date > today });
  }
  const max = Math.max(0, ...days.map((d) => d.count));
  const level = (count: number): CalendarDay['level'] =>
    count === 0 || max === 0 ? 0 : (Math.min(4, Math.ceil((count / max) * 4)) as 1 | 2 | 3 | 4);
  const out: CalendarDay[][] = [];
  for (let w = 0; w < weeks; w++)
    out.push(days.slice(w * 7, w * 7 + 7).map((d) => ({ ...d, level: level(d.count) })));
  return out;
}

/** Totals over the last `days` days including today. */
export function recentTotals(state: ProgressState, today: string, days: number) {
  let answered = 0;
  let correct = 0;
  let activeDays = 0;
  for (let i = 0; i < days; i++) {
    const a = state.activity[addDays(today, -i)];
    if (!a) continue;
    answered += a.answered;
    correct += a.correct;
    if (a.answered + a.cards > 0) activeDays++;
  }
  return { answered, correct, activeDays };
}
