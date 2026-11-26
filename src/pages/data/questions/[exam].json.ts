/**
 * The question index of one exam (QuestionMeta[]): /data/questions/<exam>.json
 * Small enough to load up front; full questions come from /data/q/<exam>/<slug>.json.
 */
import type { APIRoute, GetStaticPaths } from 'astro';

import { toMeta } from '../../../domain/question';
import { getExams, getQuestions } from '../../../lib/content';

export const getStaticPaths = (async () =>
  (await getExams()).map((exam) => ({ params: { exam: exam.id } }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params }) =>
  new Response(JSON.stringify((await getQuestions(params.exam!)).map(toMeta)), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
