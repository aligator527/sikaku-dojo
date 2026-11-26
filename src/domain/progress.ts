/**
 * Learner progress — a plain serialisable object plus pure update functions.
 * Persistence lives in src/stores/progress.ts; nothing here touches the browser,
 * so a future cloud sync can reuse the same state shape and merge logic.
 */

export const PROGRESS_VERSION = 1;
const MAX_MOCK_HISTORY = 100;

export type Outcome = 'correct' | 'partial' | 'incorrect';

export interface AttemptRecord {
  attempts: number;
  correct: number;
  last: Outcome;
  lastAt: string;
  /** Consecutive correct answers. Two or more counts as 定着 (mastered). */
  streak: number;
  /**
   * Spaced review of a question the learner got wrong: it comes back on `due`,
   * and each on-time correct answer moves it to a longer interval until it graduates.
   */
  review?: ReviewState;
}

export interface ReviewState {
  /** Index into REVIEW_INTERVALS. */
  stage: number;
  due: string;
}

/** Answers per local calendar day, for the study calendar and streaks. */
export interface DayActivity {
  answered: number;
  correct: number;
  /** Glossary flashcards reviewed. */
  cards: number;
}

export interface MockResult {
  id: string;
  exam: string;
  mockId: string;
  title: string;
  startedAt: string;
  finishedAt: string;
  durationSec: number;
  score: number;
  maxScore: number;
  passingRate: number;
  passed: boolean;
  byTopic: Record<string, { score: number; max: number }>;
  outcomes: Record<string, Outcome | 'unanswered'>;
}

/** Leitner box for a glossary flashcard. */
export interface CardRecord {
  box: number;
  due: string;
  reviewedAt: string;
}

export interface ProgressState {
  version: typeof PROGRESS_VERSION;
  attempts: Record<string, AttemptRecord>;
  bookmarks: Record<string, string>;
  mocks: MockResult[];
  goals: Record<string, { examDate?: string }>;
  cards: Record<string, CardRecord>;
  activity: Record<string, DayActivity>;
}

export const emptyProgress = (): ProgressState => ({
  version: PROGRESS_VERSION,
  attempts: {},
  bookmarks: {},
  mocks: [],
  goals: {},
  cards: {},
  activity: {},
});

/* ----------------------------- updates ----------------------------- */

/** Days until a missed question comes back, by review stage. Passing the last stage graduates it. */
export const REVIEW_INTERVALS = [1, 3, 7, 14, 30] as const;

/**
 * Where a question stands in review after this answer:
 * a miss (re)starts the schedule; a correct answer on or after the due date advances it;
 * a correct answer before the due date (e.g. an immediate retry) changes nothing.
 */
export function nextReview(
  prev: ReviewState | undefined,
  outcome: Outcome,
  today: string,
): ReviewState | undefined {
  if (outcome !== 'correct') return { stage: 0, due: addDays(today, REVIEW_INTERVALS[0]) };
  if (!prev) return undefined;
  if (today < prev.due) return prev;
  const stage = prev.stage + 1;
  return stage >= REVIEW_INTERVALS.length
    ? undefined
    : { stage, due: addDays(today, REVIEW_INTERVALS[stage]!) };
}

const bumpActivity = (state: ProgressState, day: string, change: Partial<DayActivity>) => {
  const prev = state.activity[day] ?? { answered: 0, correct: 0, cards: 0 };
  return {
    ...state.activity,
    [day]: {
      answered: prev.answered + (change.answered ?? 0),
      correct: prev.correct + (change.correct ?? 0),
      cards: prev.cards + (change.cards ?? 0),
    },
  };
};

/**
 * @param at    ISO timestamp of the answer.
 * @param today the learner's local date (YYYY-MM-DD); the review schedule and calendar use it.
 */
export function recordAttempt(
  state: ProgressState,
  questionId: string,
  outcome: Outcome,
  at: string,
  today: string = at.slice(0, 10),
): ProgressState {
  const prev = state.attempts[questionId];
  const next: AttemptRecord = {
    attempts: (prev?.attempts ?? 0) + 1,
    correct: (prev?.correct ?? 0) + (outcome === 'correct' ? 1 : 0),
    last: outcome,
    lastAt: at,
    streak: outcome === 'correct' ? (prev?.streak ?? 0) + 1 : 0,
  };
  const review = nextReview(prev?.review, outcome, today);
  if (review) next.review = review;
  return {
    ...state,
    attempts: { ...state.attempts, [questionId]: next },
    activity: bumpActivity(state, today, { answered: 1, correct: outcome === 'correct' ? 1 : 0 }),
  };
}

export function toggleBookmark(state: ProgressState, questionId: string, at: string): ProgressState {
  const bookmarks = { ...state.bookmarks };
  if (bookmarks[questionId]) delete bookmarks[questionId];
  else bookmarks[questionId] = at;
  return { ...state, bookmarks };
}

export function addMockResult(state: ProgressState, result: MockResult): ProgressState {
  const mocks = [result, ...state.mocks.filter((m) => m.id !== result.id)].slice(0, MAX_MOCK_HISTORY);
  return { ...state, mocks };
}

export function setExamDate(
  state: ProgressState,
  examId: string,
  examDate: string | undefined,
): ProgressState {
  const goals = { ...state.goals };
  if (examDate) goals[examId] = { ...goals[examId], examDate };
  else delete goals[examId];
  return { ...state, goals };
}

/** Days until the next review, indexed by Leitner box (1–5). */
export const LEITNER_INTERVALS = [0, 1, 2, 4, 8, 16] as const;
export const MAX_BOX = 5;

export function reviewCard(
  state: ProgressState,
  termId: string,
  remembered: boolean,
  today: string,
): ProgressState {
  const prevBox = state.cards[termId]?.box ?? 0;
  const box = remembered ? Math.min(prevBox + 1, MAX_BOX) : 1;
  const due = remembered ? addDays(today, LEITNER_INTERVALS[box]!) : today;
  return {
    ...state,
    cards: { ...state.cards, [termId]: { box, due, reviewedAt: today } },
    activity: bumpActivity(state, today, { cards: 1 }),
  };
}

/* ----------------------------- queries ----------------------------- */

export function isMastered(record: AttemptRecord | undefined): boolean {
  return (record?.streak ?? 0) >= 2;
}

export interface Summary {
  total: number;
  answered: number;
  /** Questions whose most recent attempt was correct. */
  lastCorrect: number;
  mastered: number;
  /** Correct attempts / all attempts, or null if nothing answered. */
  accuracy: number | null;
}

export function summarize(state: ProgressState, questionIds: readonly string[]): Summary {
  let answered = 0;
  let lastCorrect = 0;
  let mastered = 0;
  let attempts = 0;
  let correct = 0;
  for (const id of questionIds) {
    const r = state.attempts[id];
    if (!r) continue;
    answered++;
    attempts += r.attempts;
    correct += r.correct;
    if (r.last === 'correct') lastCorrect++;
    if (isMastered(r)) mastered++;
  }
  return {
    total: questionIds.length,
    answered,
    lastCorrect,
    mastered,
    accuracy: attempts > 0 ? correct / attempts : null,
  };
}

export function summarizeByTopic(
  state: ProgressState,
  questions: readonly { id: string; topics: string[] }[],
): Map<string, Summary> {
  const ids = new Map<string, string[]>();
  for (const q of questions) {
    for (const t of q.topics) ids.set(t, [...(ids.get(t) ?? []), q.id]);
  }
  return new Map([...ids].map(([topic, qids]) => [topic, summarize(state, qids)]));
}

/** Topics with the lowest accuracy among those with at least `minAnswered` answered questions. */
export function weakestTopics(byTopic: Map<string, Summary>, limit = 3, minAnswered = 2): string[] {
  return [...byTopic]
    .filter(([, s]) => s.answered >= minAnswered && s.accuracy !== null && s.accuracy < 0.8)
    .sort(([, a], [, b]) => a.accuracy! - b.accuracy!)
    .slice(0, limit)
    .map(([topic]) => topic);
}

export function dueCards(state: ProgressState, termIds: readonly string[], today: string): string[] {
  return termIds.filter((id) => {
    const card = state.cards[id];
    return !card || card.due <= today;
  });
}

/** Questions whose review is due on or before `today`, most overdue first. */
export function dueReviews(state: ProgressState, questionIds: readonly string[], today: string): string[] {
  return questionIds
    .filter((id) => {
      const due = state.attempts[id]?.review?.due;
      return due !== undefined && due <= today;
    })
    .sort((a, b) => state.attempts[a]!.review!.due.localeCompare(state.attempts[b]!.review!.due));
}

/** Number of reviews falling due on each of the next `days` days (index 0 = tomorrow). */
export function upcomingReviews(
  state: ProgressState,
  questionIds: readonly string[],
  today: string,
  days = 7,
): number[] {
  const counts = Array.from({ length: days }, () => 0);
  for (const id of questionIds) {
    const due = state.attempts[id]?.review?.due;
    if (!due || due <= today) continue;
    const d = daysBetween(today, due) - 1;
    if (d >= 0 && d < days) counts[d]!++;
  }
  return counts;
}

const activeOn = (state: ProgressState, day: string) => {
  const a = state.activity[day];
  return Boolean(a && a.answered + a.cards > 0);
};

/**
 * Consecutive days with any study, counting back from today.
 * A streak survives until the end of today, so yesterday's streak still counts this morning.
 */
export function currentStreak(state: ProgressState, today: string): number {
  let day = activeOn(state, today) ? today : addDays(today, -1);
  let n = 0;
  while (activeOn(state, day)) {
    n++;
    day = addDays(day, -1);
  }
  return n;
}

export function longestStreak(state: ProgressState): number {
  const days = Object.keys(state.activity)
    .filter((d) => activeOn(state, d))
    .sort();
  let best = 0;
  let run = 0;
  let prev = '';
  for (const d of days) {
    run = prev && daysBetween(prev, d) === 1 ? run + 1 : 1;
    best = Math.max(best, run);
    prev = d;
  }
  return best;
}

/* ---------------------------- import/merge ---------------------------- */

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

function pickRecords<T>(value: unknown, valid: (v: unknown) => v is T): Record<string, T> {
  if (!isRecord(value)) return {};
  return Object.fromEntries(Object.entries(value).filter(([, v]) => valid(v))) as Record<string, T>;
}

const isAttempt = (v: unknown): v is AttemptRecord =>
  isRecord(v) &&
  typeof v.attempts === 'number' &&
  typeof v.correct === 'number' &&
  typeof v.lastAt === 'string';
const isCard = (v: unknown): v is CardRecord =>
  isRecord(v) && typeof v.box === 'number' && typeof v.due === 'string';
const isMock = (v: unknown): v is MockResult =>
  isRecord(v) && typeof v.id === 'string' && typeof v.exam === 'string' && typeof v.score === 'number';
const isGoal = (v: unknown): v is { examDate?: string } => isRecord(v);
const isDay = (v: unknown): v is DayActivity =>
  isRecord(v) && typeof v.answered === 'number' && typeof v.correct === 'number';
const isReview = (v: unknown): v is ReviewState =>
  isRecord(v) && typeof v.stage === 'number' && typeof v.due === 'string';

/** Drops a malformed review instead of the whole attempt record. */
const cleanAttempt = (r: AttemptRecord): AttemptRecord => {
  if (r.review === undefined || isReview(r.review)) return r;
  const { review: _drop, ...rest } = r;
  return rest;
};

/**
 * Accepts anything (localStorage contents, an imported file) and returns a valid state,
 * keeping every well-formed record and silently dropping the rest.
 */
export function parseProgress(raw: unknown): ProgressState {
  if (!isRecord(raw)) return emptyProgress();
  return {
    version: PROGRESS_VERSION,
    attempts: Object.fromEntries(
      Object.entries(pickRecords(raw.attempts, isAttempt)).map(([id, r]) => [id, cleanAttempt(r)]),
    ),
    bookmarks: pickRecords(raw.bookmarks, (v): v is string => typeof v === 'string'),
    mocks: Array.isArray(raw.mocks) ? raw.mocks.filter(isMock).slice(0, MAX_MOCK_HISTORY) : [],
    goals: pickRecords(raw.goals, isGoal),
    cards: pickRecords(raw.cards, isCard),
    activity: Object.fromEntries(
      Object.entries(pickRecords(raw.activity, isDay)).map(([day, a]) => [
        day,
        { answered: a.answered, correct: a.correct, cards: typeof a.cards === 'number' ? a.cards : 0 },
      ]),
    ),
  };
}

const later = <T extends { lastAt?: string; reviewedAt?: string }>(a: T | undefined, b: T): T =>
  !a || (b.lastAt ?? b.reviewedAt ?? '') > (a.lastAt ?? a.reviewedAt ?? '') ? b : a;

/** Merges another device's export into the current state; the more recent record wins. */
export function mergeProgress(base: ProgressState, incoming: ProgressState): ProgressState {
  const attempts = { ...base.attempts };
  for (const [id, r] of Object.entries(incoming.attempts)) attempts[id] = later(attempts[id], r);
  const cards = { ...base.cards };
  for (const [id, c] of Object.entries(incoming.cards)) cards[id] = later(cards[id], c);
  const mocks = [...new Map([...incoming.mocks, ...base.mocks].map((m) => [m.id, m])).values()]
    .sort((a, b) => b.finishedAt.localeCompare(a.finishedAt))
    .slice(0, MAX_MOCK_HISTORY);
  // Per day, keep the larger count: merging the same export twice must not double it.
  const activity = { ...base.activity };
  for (const [day, a] of Object.entries(incoming.activity)) {
    const b = activity[day];
    activity[day] = b
      ? {
          answered: Math.max(a.answered, b.answered),
          correct: Math.max(a.correct, b.correct),
          cards: Math.max(a.cards, b.cards),
        }
      : a;
  }
  return {
    version: PROGRESS_VERSION,
    attempts,
    bookmarks: { ...incoming.bookmarks, ...base.bookmarks },
    mocks,
    goals: { ...base.goals, ...incoming.goals },
    cards,
    activity,
  };
}

/* ------------------------------ dates ------------------------------ */

/** Local calendar date as YYYY-MM-DD. */
export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function addDays(dateKey: string, days: number): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  return toDateKey(new Date(y!, m! - 1, d! + days));
}

export function daysBetween(fromKey: string, toKey: string): number {
  const parse = (k: string) => {
    const [y, m, d] = k.split('-').map(Number);
    return Date.UTC(y!, m! - 1, d!);
  };
  return Math.round((parse(toKey) - parse(fromKey)) / 86_400_000);
}
