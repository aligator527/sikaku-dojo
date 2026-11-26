/**
 * The single client-side store for learner progress.
 * Components read it through useProgress(); writes go through `progress.*` actions,
 * which delegate to the pure functions in src/domain/progress.ts.
 */
import { atom } from 'nanostores';

import {
  addMockResult,
  emptyProgress,
  mergeProgress,
  parseProgress,
  recordAttempt,
  reviewCard,
  setExamDate,
  toDateKey,
  toggleBookmark,
  type MockResult,
  type Outcome,
  type ProgressState,
} from '../domain/progress';
import { localStorageAdapter, type ProgressStorage } from '../lib/storage';

export const STORAGE_KEY = 'sikaku-dojo:progress:v1';

export const $progress = atom<ProgressState>(emptyProgress());
export const $progressReady = atom(false);

let storage: ProgressStorage | undefined;

/** Idempotent. Call from an effect so server and first client render agree. */
export function initProgress(adapter: ProgressStorage = localStorageAdapter(STORAGE_KEY)): void {
  if (storage) return;
  storage = adapter;
  $progress.set(parseProgress(storage.load()));
  storage.subscribe((value) => $progress.set(parseProgress(value)));
  $progressReady.set(true);
}

function update(change: (state: ProgressState) => ProgressState): void {
  const next = change($progress.get());
  $progress.set(next);
  storage?.save(next);
}

const now = () => new Date().toISOString();

export const progress = {
  recordAttempt: (questionId: string, outcome: Outcome) =>
    update((s) => recordAttempt(s, questionId, outcome, now(), toDateKey(new Date()))),
  toggleBookmark: (questionId: string) => update((s) => toggleBookmark(s, questionId, now())),
  addMockResult: (result: MockResult) => update((s) => addMockResult(s, result)),
  setExamDate: (examId: string, date: string | undefined) => update((s) => setExamDate(s, examId, date)),
  reviewCard: (termId: string, remembered: boolean) =>
    update((s) => reviewCard(s, termId, remembered, toDateKey(new Date()))),
  importState: (raw: unknown, mode: 'merge' | 'replace') =>
    update((s) => (mode === 'merge' ? mergeProgress(s, parseProgress(raw)) : parseProgress(raw))),
  reset: () => update(() => emptyProgress()),
};
