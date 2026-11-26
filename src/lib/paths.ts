/**
 * Every internal URL goes through here so the site works both at "/" (local dev)
 * and under a sub-path such as "/sikaku-dojo/" (GitHub Pages project site).
 */
const BASE = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

export function href(path = ''): string {
  return BASE + path.replace(/^\/+/, '');
}

export const routes = {
  home: () => href(),
  exams: () => href('exams/'),
  exam: (exam: string) => href(`exams/${exam}/`),
  questions: (exam: string) => href(`exams/${exam}/questions/`),
  topic: (exam: string, topic: string) => href(`exams/${exam}/topics/${topic}/`),
  question: (exam: string, slug: string) => href(`exams/${exam}/questions/${slug}/`),
  drill: (exam: string) => href(`exams/${exam}/drill/`),
  mocks: (exam: string) => href(`exams/${exam}/mock/`),
  mock: (exam: string, mockSlug: string) => href(`exams/${exam}/mock/${mockSlug}/`),
  examGlossary: (exam: string) => href(`exams/${exam}/glossary/`),
  guide: (exam: string) => href(`exams/${exam}/guide/`),
  formulas: (exam: string) => href(`exams/${exam}/formulas/`),
  resources: (exam: string) => href(`exams/${exam}/resources/`),
  glossary: () => href('glossary/'),
  term: (slug: string) => href(`glossary/${slug}/`),
  flashcards: () => href('glossary/cards/'),
  me: () => href('me/'),
  search: () => href('search/'),
  about: () => href('about/'),
  tools: () => href('tools/'),
  roadmap: () => href('roadmap/'),
  tables: () => href('tools/tables/'),
  distributions: () => href('tools/distributions/'),
  statistics: () => href('tools/statistics/'),
  /** Index of one exam's questions (QuestionMeta[]). */
  questionIndex: (exam: string) => href(`data/questions/${exam}.json`),
  /** One fully rendered question. */
  questionData: (exam: string, slug: string) => href(`data/q/${exam}/${slug}.json`),
  glossaryData: () => href('data/glossary.json'),
} as const;

/** Question ids look like "toukei-2/o-001"; URLs use the part after the slash. */
export function questionHref(questionId: string): string {
  const [exam, slug] = questionId.split('/');
  return routes.question(exam!, slug!);
}
