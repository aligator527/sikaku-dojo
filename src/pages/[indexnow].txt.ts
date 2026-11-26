/**
 * IndexNow ownership key (Bing, Yandex, Naver …), published only when the INDEXNOW_KEY
 * build variable is set. The deploy workflow then submits the sitemap's URLs after each deploy.
 */
import type { APIRoute, GetStaticPaths } from 'astro';

export const getStaticPaths = (() => {
  const key = process.env.INDEXNOW_KEY?.trim();
  return key && /^[A-Za-z0-9-]{8,128}$/.test(key) ? [{ params: { indexnow: key } }] : [];
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ params }) =>
  new Response(params.indexnow, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
