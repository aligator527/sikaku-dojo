/**
 * schema.org JSON-LD for search engines. Each builder returns a plain object; BaseLayout
 * serialises whatever a page passes in its `jsonLd` prop.
 * https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
 */
import type { Exam } from '../content/exams';
import type { Question } from '../../domain/question';
import { choiceLabel } from '../../domain/labels';
import { t } from '../../i18n';

type JsonLd = Record<string, unknown>;

/** Absolute URL for a site path such as routes.exam(id) (which already includes the base). */
export const absolute = (path: string, site: URL | undefined) => new URL(path, site).toString();

/** Removes every <span class="katex-html">…</span> (the visual copy of a formula), nesting included. */
function dropKatexHtml(html: string): string {
  let out = '';
  let i = 0;
  for (;;) {
    const start = html.indexOf('<span class="katex-html"', i);
    if (start < 0) return out + html.slice(i);
    out += html.slice(i, start);
    let depth = 0;
    const tag = /<\/?span\b[^>]*>/g;
    tag.lastIndex = start;
    let m: RegExpExecArray | null;
    while ((m = tag.exec(html))) {
      depth += m[0].startsWith('</') ? -1 : 1;
      if (depth === 0) break;
    }
    i = m ? tag.lastIndex : html.length;
  }
}

/**
 * Plain text for JSON-LD. KaTeX output carries each formula twice (MathML for screen readers,
 * HTML for display); keep only its TeX source, which reads better than MathML tokens.
 */
const stripHtml = (html: string, max = 500) => {
  const text = dropKatexHtml(html)
    .replace(
      /<math[\s\S]*?<annotation encoding="application\/x-tex">([\s\S]*?)<\/annotation>[\s\S]*?<\/math>/g,
      ' $1 ',
    )
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
  return [...text].length > max ? `${[...text].slice(0, max).join('')}…` : text;
};

export function websiteLd(url: string): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: t.site.name,
    alternateName: 'Shikaku Dojo',
    url,
    inLanguage: 'ja',
    description: t.site.description,
  };
}

export function breadcrumbLd(items: { label: string; url: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      item: item.url,
    })),
  };
}

/** The qualification itself, on its overview page. */
export function credentialLd(exam: Exam, url: string): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOccupationalCredential',
    name: exam.name,
    alternateName: exam.shortName,
    description: exam.summary,
    url,
    credentialCategory: exam.level ? `資格（${exam.level}）` : '資格',
    recognizedBy: { '@type': 'Organization', name: exam.organizer.name, url: exam.organizer.url },
    inLanguage: 'ja',
  };
}

/** One practice question as a single-question Quiz with its accepted answer. */
export function questionLd(question: Question, exam: Exam, url: string, topic: string): JsonLd {
  const choices = question.format === 'single' || question.format === 'multiple' ? question.choicesHtml : [];
  const label = (n: number) => choiceLabel(exam.choiceStyle, n);
  let accepted: string | undefined;
  switch (question.format) {
    case 'single':
      accepted = `${label(question.answer)} ${stripHtml(choices[question.answer - 1] ?? '', 200)}`;
      break;
    case 'multiple':
      accepted = question.answer
        .map((n) => `${label(n)} ${stripHtml(choices[n - 1] ?? '', 120)}`)
        .join(' / ');
      break;
    case 'numeric':
      accepted = `${question.answer.value}${question.answer.unit ?? ''}`;
      break;
    case 'journal':
      accepted = [
        ...question.answer.debit.map((l) => `（借）${l.account} ${l.amount.toLocaleString('ja-JP')}`),
        ...question.answer.credit.map((l) => `（貸）${l.account} ${l.amount.toLocaleString('ja-JP')}`),
      ].join(' ');
      break;
    case 'table':
      // Each row's label (its first printed cell) and the amounts or names that go into its boxes.
      accepted = question.tables
        .flatMap((table) =>
          table.rows.map((row) => {
            const label = row.find((c) => c.kind === 'text' && c.html !== '');
            const answers = row.flatMap((c) =>
              c.kind === 'input' && c.answer !== null
                ? [typeof c.answer === 'number' ? c.answer.toLocaleString('ja-JP') : c.answer[0]!]
                : [],
            );
            const name = label?.kind === 'text' ? stripHtml(label.html, 30) : '';
            return answers.length ? `${name} ${answers.join('・')}`.trim() : '';
          }),
        )
        .filter(Boolean)
        .join(' / ')
        .slice(0, 300);
      break;
    case 'essay':
      accepted = stripHtml(question.modelAnswerHtml, 300);
      break;
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    name: `${exam.name} ${t.question.number(question.order)}`,
    url,
    inLanguage: 'ja',
    isAccessibleForFree: true,
    educationalLevel: exam.level,
    about: { '@type': 'Thing', name: topic },
    isPartOf: { '@type': 'EducationalOccupationalCredential', name: exam.name },
    hasPart: [
      {
        '@type': 'Question',
        name: stripHtml(question.stemHtml, 110),
        text: stripHtml(`${question.passageHtml ?? ''} ${question.stemHtml}`, 600),
        eduQuestionType:
          question.format === 'essay' ? 'Essay' : choices.length ? 'Multiple choice' : 'Short answer',
        ...(choices.length
          ? {
              suggestedAnswer: choices.map((c, i) => ({
                '@type': 'Answer',
                text: `${label(i + 1)} ${stripHtml(c, 160)}`,
              })),
            }
          : {}),
        ...(accepted ? { acceptedAnswer: { '@type': 'Answer', text: accepted } } : {}),
      },
    ],
  };
}

export function definedTermLd(
  term: { term: string; reading: string; en?: string; aliases: string[]; summary: string },
  url: string,
  setUrl: string,
): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: term.term,
    alternateName: [term.reading, ...(term.en ? [term.en] : []), ...term.aliases],
    description: term.summary,
    url,
    inDefinedTermSet: { '@type': 'DefinedTermSet', name: `${t.site.name} ${t.glossary.title}`, url: setUrl },
  };
}

export function articleLd(a: {
  headline: string;
  description: string;
  url: string;
  dateModified: string;
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.headline,
    description: a.description,
    url: a.url,
    dateModified: a.dateModified,
    inLanguage: 'ja',
    publisher: { '@type': 'Organization', name: t.site.name },
  };
}
