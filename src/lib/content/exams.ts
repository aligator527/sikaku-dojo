import { getCollection, type CollectionEntry } from 'astro:content';

import { CATEGORIES, FAMILIES, type CategoryId } from '../../config/catalog';
import type { ExamContext } from '../../domain/question';
import { assertContentIntegrity } from './integrity';

export type Exam = CollectionEntry<'exams'>['data'] & { id: string };

const familyRank = (exam: Exam) => FAMILIES.findIndex((f) => f.id === exam.family);

let cache: Promise<Exam[]> | undefined;

/** All exams in catalog order. The first call also validates cross-file references. */
export function getExams(): Promise<Exam[]> {
  cache ??= (async () => {
    await assertContentIntegrity();
    const entries = await getCollection('exams');
    return entries
      .map((e) => ({ id: e.id, ...e.data }))
      .sort((a, b) => familyRank(a) - familyRank(b) || a.order - b.order);
  })();
  return cache;
}

export async function getExam(id: string): Promise<Exam> {
  const exam = (await getExams()).find((e) => e.id === id);
  if (!exam) throw new Error(`Unknown exam "${id}"`);
  return exam;
}

export async function getExamsByCategory(): Promise<{ id: CategoryId; name: string; exams: Exam[] }[]> {
  const exams = await getExams();
  return CATEGORIES.map((c) => ({ ...c, exams: exams.filter((e) => e.category === c.id) })).filter(
    (c) => c.exams.length > 0,
  );
}

export function topicName(exam: Exam, topicId: string): string {
  return exam.topics.find((t) => t.id === topicId)?.name ?? topicId;
}

/** Topics clustered by their optional `group`, preserving file order. */
export function groupedTopics(exam: Exam): { group: string | undefined; topics: Exam['topics'] }[] {
  const groups: { group: string | undefined; topics: Exam['topics'] }[] = [];
  for (const topic of exam.topics) {
    const last = groups.at(-1);
    if (last && last.group === topic.group) last.topics.push(topic);
    else groups.push({ group: topic.group, topics: [topic] });
  }
  return groups;
}

const cut = (text: string) => text.split(/[（(。、]/)[0]!.trim();

/** Short format label ("CBT・90分") for headers and the catalog. */
export function formatBrief(exam: Exam): string {
  return exam.format.short ?? `${cut(exam.format.method)}・${cut(exam.format.duration)}`;
}

/** The slice of exam metadata the interactive islands need. */
export function examContext(exam: Exam): ExamContext {
  return {
    id: exam.id,
    shortName: exam.shortName,
    choiceStyle: exam.choiceStyle,
    topics: Object.fromEntries(exam.topics.map((t) => [t.id, t.name])),
    sections: Object.fromEntries(exam.sections.map((s) => [s.id, s.name])),
    tables: exam.tools.includes('tables'),
  };
}
