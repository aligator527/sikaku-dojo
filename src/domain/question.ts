/**
 * Question shapes as they travel to the browser.
 *
 * Content files (src/content/questions) are validated by the zod schema in
 * src/content.config.ts and converted into these DTOs at build time by
 * src/lib/content/questions.ts. Every Markdown field is pre-rendered to HTML,
 * so client code never ships a Markdown or KaTeX parser.
 */
import type { ChoiceStyle } from '../config/catalog';

export type QuestionFormat = 'single' | 'multiple' | 'numeric' | 'journal' | 'essay';
export type SourceKind = 'past' | 'adapted' | 'original';
export type Difficulty = 1 | 2 | 3;

export interface JournalLine {
  account: string;
  amount: number;
}

export interface JournalEntry {
  debit: JournalLine[];
  credit: JournalLine[];
}

export interface NumericAnswer {
  value: number;
  tolerance: number;
  unit?: string;
}

interface QuestionBase {
  /** Collection id, e.g. "toukei-2/o-001". Globally unique. */
  id: string;
  /** Last path segment, used in URLs. */
  slug: string;
  exam: string;
  section?: string;
  topics: string[];
  difficulty: Difficulty;
  points: number;
  order: number;
  source: { kind: SourceKind; label?: string; year?: number; url?: string; note?: string };
  passageHtml?: string;
  stemHtml: string;
  explanationHtml: string;
}

export type SingleQuestion = QuestionBase & { format: 'single'; choicesHtml: string[]; answer: number };
export type MultipleQuestion = QuestionBase & { format: 'multiple'; choicesHtml: string[]; answer: number[] };
export type NumericQuestion = QuestionBase & { format: 'numeric'; answer: NumericAnswer; inputHint?: string };
export type JournalQuestion = QuestionBase & { format: 'journal'; accounts: string[]; answer: JournalEntry };
export type EssayQuestion = QuestionBase & {
  format: 'essay';
  modelAnswerHtml: string;
  rubric: string[];
  charLimit?: number;
};

export type Question = SingleQuestion | MultipleQuestion | NumericQuestion | JournalQuestion | EssayQuestion;

/**
 * The lightweight index entry of a question: everything needed to filter, sample and list,
 * without the rendered HTML. Drills and mocks load the index first and full questions on demand.
 */
export interface QuestionMeta {
  id: string;
  slug: string;
  exam: string;
  section?: string;
  topics: string[];
  difficulty: Difficulty;
  points: number;
  order: number;
  format: QuestionFormat;
  source: { kind: SourceKind; year?: number };
}

export const toMeta = (q: Question): QuestionMeta => ({
  id: q.id,
  slug: q.slug,
  exam: q.exam,
  ...(q.section ? { section: q.section } : {}),
  topics: q.topics,
  difficulty: q.difficulty,
  points: q.points,
  order: q.order,
  format: q.format,
  source: q.source.year ? { kind: q.source.kind, year: q.source.year } : { kind: q.source.kind },
});

/**
 * The question minus the HTML that a static page already shows (passage, stem, explanation,
 * model answer). The page's island needs only what it takes to answer and grade.
 */
export function answerOnly(q: Question): Question {
  const slim = { ...q, stemHtml: '', passageHtml: undefined, explanationHtml: '' };
  return slim.format === 'essay' ? { ...slim, modelAnswerHtml: '', rubric: [] } : slim;
}

/** What the learner submitted. Mirrors Question['format']. */
export type Response =
  | { format: 'single'; choice: number }
  | { format: 'multiple'; choices: number[] }
  | { format: 'numeric'; value: string }
  | { format: 'journal'; entry: JournalEntry }
  | { format: 'essay'; text: string; selfGrade?: SelfGrade };

export type SelfGrade = 'good' | 'partial' | 'poor';

/** Exam-level context the question UI needs. */
export interface ExamContext {
  id: string;
  shortName: string;
  choiceStyle: ChoiceStyle;
  topics: Record<string, string>;
  sections: Record<string, string>;
  /** Show the 付表 button (statistics exams). */
  tables: boolean;
}
