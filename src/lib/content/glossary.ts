import { getCollection, type CollectionEntry } from 'astro:content';

import { compareReading, kanaRow, type KanaRow } from '../../domain/kana';
import { renderMarkdown } from '../markdown/render';

export type TermEntry = CollectionEntry<'glossary'>;

export interface Term {
  id: string;
  term: string;
  reading: string;
  en?: string;
  aliases: string[];
  exams: string[];
  summary: string;
  related: string[];
  formulaHtml?: string;
  row: KanaRow;
}

let cache: Promise<Term[]> | undefined;

/** All glossary terms in 50音 order. */
export function getTerms(): Promise<Term[]> {
  cache ??= getCollection('glossary').then((entries) =>
    Promise.all(
      entries
        .sort((a, b) => compareReading(a.data.reading, b.data.reading))
        .map(async (e) => ({
          id: e.id,
          term: e.data.term,
          reading: e.data.reading,
          en: e.data.en,
          aliases: e.data.aliases,
          exams: e.data.exams.map((x) => x.id),
          summary: e.data.summary,
          related: e.data.related.map((x) => x.id),
          formulaHtml: e.data.formula ? await renderMarkdown(`$$\n${e.data.formula}\n$$`) : undefined,
          row: kanaRow(e.data.reading),
        })),
    ),
  );
  return cache;
}

export async function getTermsForExam(examId: string): Promise<Term[]> {
  return (await getTerms()).filter((t) => t.exams.includes(examId));
}

export async function getTermEntries(): Promise<TermEntry[]> {
  return getCollection('glossary');
}
