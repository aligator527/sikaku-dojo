/**
 * Question data for islands. The index of an exam is fetched once; full questions are fetched
 * on demand and cached for the lifetime of the page, so revisiting or prefetching is free.
 */
import { useEffect, useState } from 'react';

import type { Question, QuestionMeta } from '../../domain/question';
import { routes } from '../../lib/paths';

export type Loadable<T> = { status: 'loading' } | { status: 'error' } | { status: 'ready'; value: T };

const indexes = new Map<string, Promise<QuestionMeta[]>>();
const questions = new Map<string, Promise<Question>>();

async function getJson<T>(url: string): Promise<T> {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return (await r.json()) as T;
}

/** Forget a failed request so the next call retries it. */
function remember<T>(cache: Map<string, Promise<T>>, key: string, load: () => Promise<T>): Promise<T> {
  let p = cache.get(key);
  if (!p) {
    p = load();
    p.catch(() => cache.delete(key));
    cache.set(key, p);
  }
  return p;
}

export const loadIndex = (examId: string) =>
  remember(indexes, examId, () => getJson<QuestionMeta[]>(routes.questionIndex(examId)));

/** Question ids look like "toukei-2/o-001". */
export function loadQuestion(id: string): Promise<Question> {
  const [exam, slug] = id.split('/') as [string, string];
  return remember(questions, id, () => getJson<Question>(routes.questionData(exam, slug)));
}

export const loadQuestions = (ids: readonly string[]) => Promise.all(ids.map(loadQuestion));

/** Warm the cache without waiting (e.g. the next question in a drill). */
export function prefetchQuestion(id: string | undefined): void {
  if (id) loadQuestion(id).catch(() => {});
}

function useLoadable<T>(key: string | undefined, load: () => Promise<T>): Loadable<T> {
  const [state, setState] = useState<Loadable<T> & { key?: string }>({ status: 'loading' });
  useEffect(() => {
    if (key === undefined) return;
    let cancelled = false;
    setState({ status: 'loading', key });
    load()
      .then((value) => !cancelled && setState({ status: 'ready', value, key }))
      .catch(() => !cancelled && setState({ status: 'error', key }));
    return () => {
      cancelled = true;
    };
    // `load` is derived from `key`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  // Never show the previous key's value while the next one loads.
  return state.key === key ? state : { status: 'loading' };
}

export const useQuestionIndex = (examId: string) => useLoadable(examId, () => loadIndex(examId));

export const useQuestion = (id: string | undefined) => useLoadable(id, () => loadQuestion(id!));

/** Indexes of several exams at once, keyed by exam id. Pass an empty list to load nothing. */
export function useIndexes(examIds: readonly string[]) {
  const key = examIds.join(',');
  return useLoadable(key, async () => {
    const lists = await Promise.all(examIds.map(loadIndex));
    return Object.fromEntries(examIds.map((id, i) => [id, lists[i]!])) as Record<string, QuestionMeta[]>;
  });
}
