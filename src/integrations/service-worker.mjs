/**
 * Generates the service worker and the offline packs after `astro build`.
 *
 *   sw.js                 — caches the app shell, keeps visited pages for offline use
 *   offline/<exam>.json   — the URLs (and total size) of one exam, for "オフライン用に保存"
 *
 * The worker source lives in ./sw-template.js; this file only injects the build-specific lists.
 */
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

/** Pages every pack includes, so the app is navigable offline. */
const SHARED_PAGES = [
  '',
  'exams/',
  'me/',
  'roadmap/',
  'tools/',
  'tools/tables/',
  'tools/distributions/',
  'tools/statistics/',
  'glossary/',
  'glossary/cards/',
  'data/glossary.json', // flashcard data, so 用語カード works offline
  'offline/',
];

function walk(dir, root = dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, root, out);
    else out.push({ rel: path.relative(root, full).split(path.sep).join('/'), size: st.size });
  }
  return out;
}

/** "exams/x/index.html" → "exams/x/" (the URL the browser requests with trailingSlash: always). */
const toUrlPath = (rel) =>
  rel === 'index.html' ? '' : rel.endsWith('/index.html') ? rel.slice(0, -'index.html'.length) : rel;

export default function serviceWorker() {
  let base = '/';
  return {
    name: 'sikaku-dojo:service-worker',
    hooks: {
      'astro:config:done': ({ config }) => {
        base = config.base.endsWith('/') ? config.base : `${config.base}/`;
      },
      'astro:build:done': ({ dir, logger }) => {
        const dist = fileURLToPath(dir);
        const files = walk(dist);
        const sizeOf = new Map(files.map((f) => [toUrlPath(f.rel), f.size]));
        const template = readFileSync(path.join(here, 'sw-template.js'), 'utf8');
        const version = createHash('sha256')
          .update(template)
          .update(files.map((f) => `${f.rel}:${f.size}`).join('\n'))
          .digest('hex')
          .slice(0, 12);

        // App shell: hashed JS/CSS and the woff2 fonts KaTeX needs (woff/ttf are fallbacks
        // no current browser downloads), icons, the question indexes and the offline page.
        const assets = files
          .map((f) => f.rel)
          .filter((rel) => rel.startsWith('_astro/') && /\.(js|css|woff2)$/.test(rel));
        const core = [
          '',
          'offline/',
          'manifest.webmanifest',
          'favicon.svg',
          'icon-192.png',
          ...files.map((f) => f.rel).filter((rel) => /^data\/questions\/[^/]+\.json$/.test(rel)),
        ].filter((p) => sizeOf.has(p));

        // One pack per exam: the exam's pages, its question data and the shared pages.
        // Single-question pages are left out — offline, the fallback page renders them from the
        // question JSON (src/components/offline/OfflineFallback.tsx) — which halves the download.
        const isQuestionPage = (rel) => /^exams\/[^/]+\/questions\/[^/]+\/index\.html$/.test(rel);
        mkdirSync(path.join(dist, 'offline'), { recursive: true });
        const examIds = readdirSync(path.join(dist, 'exams')).filter((n) =>
          statSync(path.join(dist, 'exams', n)).isDirectory(),
        );
        for (const id of examIds) {
          const urls = [
            ...SHARED_PAGES,
            ...files
              .map((f) => f.rel)
              .filter(
                (rel) =>
                  (rel.startsWith(`exams/${id}/`) && rel.endsWith('.html') && !isQuestionPage(rel)) ||
                  rel.startsWith(`data/q/${id}/`),
              )
              .map(toUrlPath),
            `data/questions/${id}.json`,
          ].filter((p) => sizeOf.has(p));
          const unique = [...new Set(urls)];
          const bytes = unique.reduce((n, p) => n + (sizeOf.get(p) ?? 0), 0);
          writeFileSync(
            path.join(dist, 'offline', `${id}.json`),
            JSON.stringify({ exam: id, version, bytes, urls: unique.map((p) => base + p) }),
          );
        }

        const sw = template
          .replace('__VERSION__', JSON.stringify(version))
          .replace('__BASE__', JSON.stringify(base))
          .replace('__CORE__', JSON.stringify(core.map((p) => base + p)))
          .replace('__ASSETS__', JSON.stringify(assets.map((p) => base + p)));
        writeFileSync(path.join(dist, 'sw.js'), sw);
        logger.info(
          `sw.js ${version}: ${core.length} core files, ${assets.length} assets, ${examIds.length} offline packs`,
        );
      },
    },
  };
}
