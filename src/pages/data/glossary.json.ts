/**
 * Glossary terms for the flashcard island: only what a card shows, with formulas as TeX.
 * Pre-rendered KaTeX would make this file about ten times larger.
 */
import type { APIRoute } from 'astro';

import { getTerms, type CardTerm } from '../../lib/content';

export const GET: APIRoute = async () => {
  const cards: CardTerm[] = (await getTerms()).map(({ id, term, reading, en, exams, summary, formula }) => ({
    id,
    term,
    reading,
    en,
    exams,
    summary,
    formula,
  }));
  return new Response(JSON.stringify(cards), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
