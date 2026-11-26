// @ts-check
import { unified } from '@astrojs/markdown-remark';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import serviceWorker from './src/integrations/service-worker.mjs';
import { rehypePlugins, remarkPlugins, shikiConfig } from './src/lib/markdown/options.mjs';

/**
 * SITE_URL / BASE_PATH are injected by the GitHub Pages workflow
 * (.github/workflows/deploy.yml). Locally the site is served from "/".
 */
const site = process.env.SITE_URL || 'http://localhost:4321';
const base = process.env.BASE_PATH || '/';

/**
 * CONTENT_WATCH=off stops the dev server from reloading on every question file change —
 * useful when a batch of questions is being written while you work on the UI.
 */
const watchIgnored = process.env.CONTENT_WATCH === 'off' ? ['**/src/content/questions/**'] : [];

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  integrations: [react(), sitemap({ filter: (page) => !page.includes('/offline/') }), serviceWorker()],
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig,
    // SmartyPants is off: it rewrites quotes and dashes, which breaks Japanese text and code.
    processor: unified({ gfm: true, smartypants: false, remarkPlugins, rehypePlugins }),
  },
  devToolbar: { enabled: false },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  vite: { server: { watch: { ignored: watchIgnored } } },
});
