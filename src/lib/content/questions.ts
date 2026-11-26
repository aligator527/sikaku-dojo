import { getCollection, type CollectionEntry } from 'astro:content';

import type { Question } from '../../domain/question';
import { renderInline, renderMarkdown } from '../markdown/render';

type QuestionEntry = CollectionEntry<'questions'>;

const KIND_RANK = { past: 0, adapted: 1, original: 2 } as const;

function compareEntries(a: QuestionEntry, b: QuestionEntry): number {
  const ao = a.data.order ?? Number.POSITIVE_INFINITY;
  const bo = b.data.order ?? Number.POSITIVE_INFINITY;
  if (ao !== bo) return ao - bo;
  const kind = KIND_RANK[a.data.source.kind] - KIND_RANK[b.data.source.kind];
  if (kind !== 0) return kind;
  const year = (b.data.source.year ?? 0) - (a.data.source.year ?? 0);
  if (year !== 0) return year;
  return a.id.localeCompare(b.id, 'en', { numeric: true });
}

export const slugOf = (id: string) => id.slice(id.indexOf('/') + 1);

async function toQuestion(entry: QuestionEntry, order: number): Promise<Question> {
  const d = entry.data;
  const base = {
    id: entry.id,
    slug: slugOf(entry.id),
    exam: d.exam.id,
    section: d.section,
    topics: d.topics,
    difficulty: d.difficulty,
    points: d.points,
    order,
    source: d.source,
    passageHtml: d.passage ? await renderMarkdown(d.passage) : undefined,
    stemHtml: await renderMarkdown(d.stem),
    explanationHtml: entry.rendered?.html ?? (await renderMarkdown(entry.body ?? '')),
  };

  switch (d.format) {
    case 'single':
    case 'multiple':
      return {
        ...base,
        format: d.format,
        choicesHtml: await Promise.all(d.choices.map(renderInline)),
        answer: d.answer,
      } as Question;
    case 'numeric':
      return { ...base, format: 'numeric', answer: d.answer, inputHint: d.inputHint };
    case 'journal':
      return { ...base, format: 'journal', accounts: d.accounts, answer: d.answer };
    case 'essay':
      return {
        ...base,
        format: 'essay',
        modelAnswerHtml: await renderMarkdown(d.modelAnswer),
        rubric: d.rubric,
        charLimit: d.charLimit,
      };
  }
}

const cache = new Map<string, Promise<Question[]>>();

/** Questions of one exam, sorted and numbered (order = 1, 2, 3 …). */
export function getQuestions(examId: string): Promise<Question[]> {
  let questions = cache.get(examId);
  if (!questions) {
    questions = getCollection('questions', (e) => e.data.exam.id === examId).then((entries) =>
      Promise.all(entries.sort(compareEntries).map((e, i) => toQuestion(e, i + 1))),
    );
    cache.set(examId, questions);
  }
  return questions;
}

export async function getQuestionCounts(): Promise<Map<string, number>> {
  const counts = new Map<string, number>();
  for (const e of await getCollection('questions'))
    counts.set(e.data.exam.id, (counts.get(e.data.exam.id) ?? 0) + 1);
  return counts;
}
