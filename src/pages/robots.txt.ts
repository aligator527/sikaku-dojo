/**
 * robots.txt. Crawlers only read it at the root of a host, so it takes effect when the site
 * runs on its own domain (or as a user site); under a project path it is harmless.
 * Pages that should not be indexed carry <meta name="robots" content="noindex"> instead.
 */
import type { APIRoute } from 'astro';

import { href } from '../lib/paths';

export const GET: APIRoute = ({ site }) =>
  new Response(
    ['User-agent: *', 'Allow: /', '', `Sitemap: ${new URL(href('sitemap-index.xml'), site)}`, ''].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
