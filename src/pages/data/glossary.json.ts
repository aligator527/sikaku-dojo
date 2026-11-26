/** All glossary terms (summary + formula), fetched by the flashcard island. */
import type { APIRoute } from 'astro';

import { getTerms } from '../../lib/content';

export const GET: APIRoute = async () =>
  new Response(JSON.stringify(await getTerms()), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
