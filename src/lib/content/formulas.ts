import { getCollection } from 'astro:content';

import { renderInline, renderMarkdown } from '../markdown/render';
import { getTerms } from './glossary';

export interface FormulaItem {
  name: string;
  html: string;
  noteHtml?: string;
  term?: { slug: string; label: string };
}

export interface FormulaSection {
  title: string;
  topics: string[];
  items: FormulaItem[];
}

export interface FormulaSheet {
  exam: string;
  title: string;
  introHtml?: string;
  sections: FormulaSection[];
  updatedAt: string;
  count: number;
}

/** The 公式集 of one exam, with every formula pre-rendered by KaTeX. */
export async function getFormulaSheet(examId: string): Promise<FormulaSheet | undefined> {
  const entry = (await getCollection('formulas', (f) => f.data.exam.id === examId))[0];
  if (!entry) return undefined;
  const terms = new Map((await getTerms()).map((term) => [term.id, term.term]));
  const d = entry.data;
  const sections = await Promise.all(
    d.sections.map(async (section) => ({
      title: section.title,
      topics: section.topics,
      items: await Promise.all(
        section.items.map(async (item) => ({
          name: item.name,
          html: await renderMarkdown(`$$\n${item.tex}\n$$`),
          noteHtml: item.note ? await renderInline(item.note) : undefined,
          term:
            item.term && terms.has(item.term) ? { slug: item.term, label: terms.get(item.term)! } : undefined,
        })),
      ),
    })),
  );
  return {
    exam: examId,
    title: d.title,
    introHtml: d.intro ? await renderMarkdown(d.intro) : undefined,
    sections,
    updatedAt: d.updatedAt,
    count: sections.reduce((n, s) => n + s.items.length, 0),
  };
}

export async function getFormulaExamIds(): Promise<Set<string>> {
  return new Set((await getCollection('formulas')).map((f) => f.data.exam.id));
}
