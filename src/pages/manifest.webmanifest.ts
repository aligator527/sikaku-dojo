/** Web app manifest. Generated so start_url, scope and icons follow the deploy base path. */
import type { APIRoute } from 'astro';

import { t } from '../i18n';
import { href } from '../lib/paths';

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      name: t.site.name,
      short_name: t.site.name,
      description: t.site.description,
      lang: 'ja',
      start_url: href(),
      scope: href(),
      display: 'standalone',
      background_color: '#f6f4ee',
      theme_color: '#f6f4ee',
      icons: [
        { src: href('icon-192.png'), sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: href('icon-512.png'), sizes: '512x512', type: 'image/png', purpose: 'any' },
        { src: href('icon-maskable-512.png'), sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        { src: href('favicon.svg'), sizes: 'any', type: 'image/svg+xml' },
      ],
      shortcuts: [
        { name: t.me.title, url: href('me/') },
        { name: t.tools.tables.title, url: href('tools/tables/') },
      ],
    }),
    { headers: { 'Content-Type': 'application/manifest+json; charset=utf-8' } },
  );
