import { getCollection, type CollectionEntry } from 'astro:content';

import { compileNeedles } from '../../domain/mentions';
import { getTerms, type Term } from './glossary';

/** Where a term shows up in a question: 0 = stem, choices or case text; 1 = explanation only. */
export type MentionPlace = 0 | 1;

export interface QuestionTerm {
  term: Term;
  place: MentionPlace;
}

interface MentionIndex {
  /** question id → terms in order of first appearance (question text first). */
  byQuestion: Map<string, QuestionTerm[]>;
  /** term id → questions that mention it, those mentioning it in the question text first. */
  byTerm: Map<string, { id: string; place: MentionPlace }[]>;
}

function questionText(entry: CollectionEntry<'questions'>): string {
  const d = entry.data;
  const answerArea = 'choices' in d ? d.choices.join('\n') : 'accounts' in d ? d.accounts.join('\n') : '';
  return [d.passage ?? '', d.stem, answerArea].join('\n');
}

/**
 * A term mentioned by more than this share of an exam's questions (勘定科目 in 簿記, say) says
 * nothing about a particular question, so question pages leave it out. Term pages still list them.
 */
const UBIQUITOUS = 0.35;

let cache: Promise<MentionIndex> | undefined;

/**
 * Which glossary terms each question mentions, and the reverse. A term is only looked for in
 * the questions of the exams it lists, so a generic word does not leak into unrelated exams.
 */
export function getMentionIndex(): Promise<MentionIndex> {
  cache ??= Promise.all([getTerms(), getCollection('questions')]).then(([terms, entries]) => {
    const termById = new Map(terms.map((t) => [t.id, t]));
    // One matcher over the whole glossary, so a longer name from another field still wins
    // (感度分析 hides the 感度 inside it); only the exam's own terms are reported.
    const matcher = compileNeedles(terms.map((t) => ({ id: t.id, names: [t.term, ...t.aliases] })));
    const found = entries.map((entry) => {
      const exam = entry.data.exam.id;
      return {
        entry,
        mentions: matcher.find([questionText(entry), entry.body], (id) =>
          termById.get(id)!.exams.includes(exam),
        ),
      };
    });

    const examSize = new Map<string, number>();
    const termCount = new Map<string, number>(); // `${exam} ${term}` → questions
    for (const { entry, mentions } of found) {
      const exam = entry.data.exam.id;
      examSize.set(exam, (examSize.get(exam) ?? 0) + 1);
      for (const m of mentions) termCount.set(`${exam} ${m.id}`, (termCount.get(`${exam} ${m.id}`) ?? 0) + 1);
    }

    const byQuestion = new Map<string, QuestionTerm[]>();
    const byTermPlaced = new Map<string, { id: string; place: MentionPlace }[]>();
    for (const { entry, mentions } of found) {
      const exam = entry.data.exam.id;
      const limit = examSize.get(exam)! * UBIQUITOUS;
      byQuestion.set(
        entry.id,
        mentions
          .filter((m) => termCount.get(`${exam} ${m.id}`)! <= limit)
          .map((m) => ({ term: termById.get(m.id)!, place: m.part === 0 ? 0 : 1 })),
      );
      for (const m of mentions) {
        const list = byTermPlaced.get(m.id) ?? [];
        list.push({ id: entry.id, place: m.part === 0 ? 0 : 1 });
        byTermPlaced.set(m.id, list);
      }
    }
    const byTerm = new Map(
      [...byTermPlaced].map(([id, list]) => [id, list.sort((a, b) => a.place - b.place)]),
    );
    return { byQuestion, byTerm };
  });
  return cache;
}
