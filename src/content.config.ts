/**
 * Content collections — the single source of truth for every piece of study material.
 *
 * Authoring rules live in docs/CONTENT_GUIDE.md. Keep this file and that guide in sync.
 */
import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

import { CATEGORY_IDS, CHOICE_STYLES, FAMILY_IDS } from './config/catalog';

const link = z.object({
  label: z.string(),
  url: z.url(),
});

/** YAML parses an unquoted 2026-11-26 as a Date; accept both forms and normalise to "YYYY-MM-DD". */
const isoDate = z.preprocess((v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v), z.iso.date());

/* ------------------------------------------------------------------ */
/* exams: one YAML file per qualification (src/content/exams/<id>.yaml) */
/* ------------------------------------------------------------------ */

const exams = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/exams' }),
  schema: z.object({
    name: z.string(),
    shortName: z.string(),
    family: z.enum(FAMILY_IDS),
    category: z.enum(CATEGORY_IDS),
    level: z.string().optional(),
    order: z.number().int().default(100),
    status: z.enum(['published', 'draft', 'planned']).default('published'),
    summary: z.string(),
    organizer: z.object({ name: z.string(), url: z.url() }),
    format: z.object({
      /** One-line label for headers and lists, e.g. "CBT・90分". Falls back to method + duration. */
      short: z.string().optional(),
      method: z.string(),
      duration: z.string(),
      questions: z.string().optional(),
      answerStyle: z.string().optional(),
      passing: z.string(),
      schedule: z.string(),
      eligibility: z.string().optional(),
      notes: z.array(z.string()).default([]),
    }),
    /** How answer choices are labelled on screen, mirroring the real exam paper. */
    choiceStyle: z.enum(CHOICE_STYLES).default('number'),
    /** 試験区分・科目 (午前II, 統計数理, 第1問 …). Questions may point at one. */
    sections: z
      .array(z.object({ id: z.string(), name: z.string(), description: z.string().optional() }))
      .default([]),
    /** 出題分野. `group` is an optional heading used to cluster topics in lists. */
    topics: z.array(z.object({ id: z.string(), name: z.string(), group: z.string().optional() })).min(1),
    officialLinks: z.array(link).default([]),
    /** Study aids offered next to questions and mocks: `tables` = 統計数値表（付表）. */
    tools: z.array(z.enum(['tables'])).default([]),
    /** A notice shown on every page of the exam (e.g. the exam is being discontinued). Markdown. */
    notice: z.string().optional(),
    /** Position on the qualification roadmap: 1 = 入門 … 4 = 最上級. */
    tier: z.number().int().min(1).max(4).optional(),
    /** Suggested next steps and overlapping exams, drawn on the roadmap. */
    pathways: z
      .array(
        z.object({
          to: reference('exams'),
          kind: z.enum(['next', 'related']).default('next'),
          note: z.string(),
        }),
      )
      .default([]),
    updatedAt: isoDate,
  }),
});

/* ------------------------------------------------------------------ */
/* questions: src/content/questions/<exam-id>/<slug>.md                */
/* front matter = structure, body = 解説 (explanation)                  */
/* ------------------------------------------------------------------ */

const questionSource = z
  .object({
    /** past = 過去問 reproduced with permission, adapted = 過去問を基にした改題, original = 当サイトのオリジナル */
    kind: z.enum(['past', 'adapted', 'original']),
    /** Human readable citation, e.g. "令和5年度 春期 ITストラテジスト試験 午前II 問1" */
    label: z.string().optional(),
    year: z.number().int().optional(),
    url: z.url().optional(),
    note: z.string().optional(),
  })
  .refine((s) => s.kind === 'original' || Boolean(s.label), {
    message: 'past / adapted questions must have a source.label (出典)',
  });

const questionBase = z.object({
  exam: reference('exams'),
  section: z.string().optional(),
  topics: z.array(z.string()).min(1),
  source: questionSource,
  difficulty: z.union([z.literal(1), z.literal(2), z.literal(3)]).default(2),
  /** Score weight inside mock exams. */
  points: z.number().positive().default(1),
  /** Lower comes first in lists. Defaults to file order. */
  order: z.number().optional(),
  /** Shared material (case text, data table) shown above the stem. Markdown. */
  passage: z.string().optional(),
  stem: z.string(),
  tags: z.array(z.string()).default([]),
});

const journalLine = z.object({ account: z.string(), amount: z.number().nonnegative() });

const questionSchema = z.discriminatedUnion('format', [
  questionBase.extend({
    format: z.literal('single'),
    choices: z.array(z.string()).min(2),
    /** 1-based index of the correct choice. */
    answer: z.number().int().positive(),
  }),
  questionBase.extend({
    format: z.literal('multiple'),
    choices: z.array(z.string()).min(2),
    answer: z.array(z.number().int().positive()).min(1),
  }),
  questionBase.extend({
    format: z.literal('numeric'),
    answer: z.object({
      value: z.number(),
      /** Absolute tolerance. 0 = exact match. */
      tolerance: z.number().nonnegative().default(0),
      unit: z.string().optional(),
    }),
    /** e.g. "小数第3位を四捨五入し、小数第2位まで答えよ" */
    inputHint: z.string().optional(),
  }),
  questionBase.extend({
    format: z.literal('journal'),
    /** 勘定科目の選択肢 (as in 日商簿記ネット試験). */
    accounts: z.array(z.string()).min(2),
    answer: z.object({
      debit: z.array(journalLine).min(1),
      credit: z.array(journalLine).min(1),
    }),
  }),
  questionBase.extend({
    format: z.literal('essay'),
    modelAnswer: z.string(),
    rubric: z.array(z.string()).default([]),
    charLimit: z.number().int().positive().optional(),
  }),
]);

const questions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/questions' }),
  schema: questionSchema,
});

/* ------------------------------------------------------------------ */
/* glossary: src/content/glossary/<slug>.md, shared across exams        */
/* ------------------------------------------------------------------ */

const glossary = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/glossary' }),
  schema: z.object({
    term: z.string(),
    /** ひらがな reading — drives 50音 ordering. */
    reading: z.string().regex(/^[ぁ-ゟー・ ]+$/u, 'reading must be hiragana'),
    en: z.string().optional(),
    aliases: z.array(z.string()).default([]),
    exams: z.array(reference('exams')).min(1),
    summary: z.string(),
    related: z.array(reference('glossary')).default([]),
    /** Optional formula shown prominently (TeX, without $ delimiters). */
    formula: z.string().optional(),
  }),
});

/* ------------------------------------------------------------------ */
/* guides: 対策方法, one per exam (src/content/guides/<exam-id>.md)      */
/* ------------------------------------------------------------------ */

const guides = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/guides' }),
  schema: z.object({
    exam: reference('exams'),
    title: z.string(),
    summary: z.string(),
    studyHours: z.string().optional(),
    roadmap: z
      .array(z.object({ title: z.string(), period: z.string().optional(), detail: z.string() }))
      .default([]),
    updatedAt: isoDate,
  }),
});

/* ------------------------------------------------------------------ */
/* resources: curated external links, grouped by file                  */
/* ------------------------------------------------------------------ */

const resources = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/resources' }),
  schema: z.object({
    title: z.string(),
    items: z.array(
      z.object({
        title: z.string(),
        url: z.url(),
        publisher: z.string().optional(),
        lang: z.enum(['ja', 'en']),
        kind: z.enum(['official', 'textbook', 'article', 'video', 'course', 'tool', 'pastExam', 'community']),
        cost: z.enum(['free', 'paid', 'partial']),
        exams: z.array(reference('exams')).min(1),
        description: z.string(),
      }),
    ),
  }),
});

/* ------------------------------------------------------------------ */
/* mocks: 模擬試験 definitions (src/content/mocks/<id>.yaml)             */
/* ------------------------------------------------------------------ */

const mocks = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/mocks' }),
  schema: z
    .object({
      exam: reference('exams'),
      title: z.string(),
      description: z.string(),
      durationMin: z.number().int().positive(),
      /** 0–1, share of points needed to pass. */
      passingRate: z.number().min(0).max(1),
      order: z.number().default(100),
      /** Fixed question list … */
      questions: z.array(reference('questions')).optional(),
      /** … or a blueprint drawn at random each attempt. */
      blueprint: z
        .array(
          z.object({
            topics: z.array(z.string()).optional(),
            sections: z.array(z.string()).optional(),
            formats: z.array(z.enum(['single', 'multiple', 'numeric', 'journal', 'essay'])).optional(),
            count: z.number().int().positive(),
          }),
        )
        .optional(),
    })
    .refine((m) => Boolean(m.questions?.length) !== Boolean(m.blueprint?.length), {
      message: 'a mock needs exactly one of `questions` or `blueprint`',
    }),
});

/* ------------------------------------------------------------------ */
/* formulas: 公式集, one sheet per exam (src/content/formulas/<exam>.yaml) */
/* ------------------------------------------------------------------ */

const formulas = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/formulas' }),
  schema: z.object({
    exam: reference('exams'),
    title: z.string(),
    /** Markdown shown under the title. */
    intro: z.string().optional(),
    sections: z
      .array(
        z.object({
          title: z.string(),
          /** Topic ids of the exam, linked to the drill. */
          topics: z.array(z.string()).default([]),
          items: z
            .array(
              z.object({
                name: z.string(),
                /** TeX without $ delimiters, rendered in display mode. */
                tex: z.string(),
                /** Markdown: conditions, how to remember it, typical mistakes. */
                note: z.string().optional(),
                /** Glossary slug for a "用語集で詳しく" link. */
                term: z.string().optional(),
              }),
            )
            .min(1),
        }),
      )
      .min(1),
    updatedAt: isoDate,
  }),
});

export const collections = { exams, questions, glossary, guides, resources, mocks, formulas };
