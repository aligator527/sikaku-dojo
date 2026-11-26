# Architecture

資格道場 is a fully static site: Astro renders every page at build time, React
"islands" hydrate only the interactive parts, and learner progress lives in the
browser. There is no server, so it deploys to GitHub Pages as plain files.

```
src/content/  ──(zod schemas)──▶  src/lib/content/  ──▶  src/pages/*.astro  ──▶  static HTML
  YAML + MD        content.config.ts   typed access,          routes              + JSON data
                                       integrity checks                          + React islands
                                                                                      │
                                       src/domain/ (pure TS) ◀────────────────────────┤
                                       grading, sampling, progress, distributions     │
                                                                                      ▼
                                                         src/stores/progress.ts ─▶ localStorage
```

## Layers

| Layer          | Path                                            | Rule                                                                                                                                                                                         |
| -------------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Content        | `src/content/`                                  | Plain text only. Format documented in `docs/CONTENT_GUIDE.md`.                                                                                                                               |
| Schema         | `src/content.config.ts`                         | Per-file validation (zod).                                                                                                                                                                   |
| Catalog        | `src/config/catalog.ts`                         | Categories, families, choice label styles.                                                                                                                                                   |
| Domain         | `src/domain/`                                   | Framework-free TypeScript: grading, sampling, progress (review schedule, activity), distributions and 付表, calendar, roadmap layout, kana index. Unit-tested. Never imports Astro or React. |
| Content access | `src/lib/content/`                              | The only code that calls `getCollection`. Converts entries to DTOs, renders Markdown, runs cross-file integrity checks.                                                                      |
| Store          | `src/stores/progress.ts`                        | One nanostores atom + actions that delegate to `src/domain/progress.ts`. Persistence through the `ProgressStorage` port (`src/lib/storage.ts`).                                              |
| UI             | `src/components/`, `src/layouts/`, `src/pages/` | `.astro` for static markup, `.tsx` islands for interaction.                                                                                                                                  |
| Copy           | `src/i18n/ja.ts`                                | All interface strings.                                                                                                                                                                       |

## Data flow for a question

1. `src/content/questions/<exam>/<slug>.md` — front matter holds structure, body holds the explanation.
2. `src/lib/content/questions.ts` turns each entry into a `Question` DTO (`src/domain/question.ts`)
   with every Markdown field pre-rendered to HTML (KaTeX included). The browser never parses Markdown.
3. Static page `/exams/<exam>/questions/<slug>/` server-renders the `QuestionPage` island; the
   answer and explanation sit inside a `<details>` so they work without JavaScript and are indexed.
4. Two static endpoints feed the islands:
   - `/data/questions/<exam>.json` — the exam's index (`QuestionMeta[]`: id, topics, difficulty, format …),
     a few KB, enough to filter, sample a mock or pick 今日の一問.
   - `/data/q/<exam>/<slug>.json` — one rendered `Question`. The drill loads them one at a time and
     prefetches the next; a mock loads its selection in parallel before the clock starts.
     `src/components/hooks/useQuestionData.ts` caches both for the lifetime of the page.
5. Grading is `src/domain/grading.ts`; results go to the store through `progress.recordAttempt`, which
   also schedules spaced review (missed → 1, 3, 7, 14, 30 days) and counts the day's activity.

## Build-time guarantees

- zod schemas reject malformed files (`pnpm sync` to check quickly).
- `src/lib/content/integrity.ts` fails the build on broken references: unknown topics or sections,
  out-of-range answers, unbalanced 仕訳, missing glossary links, mocks pointing at other exams.
- `pnpm test` covers the domain layer; `pnpm check` type-checks `.astro` and `.tsx`.
- `pnpm validate` (`scripts/validate-content.mjs`) is a fast, Astro-free content lint: it compiles every
  TeX fragment with the same KaTeX as the site, rejects TeX inside double-quoted YAML, choice labels typed
  into choices, duplicate stems, unknown keys and verbatim past questions from organisers other than IPA.
  It is safe to run while other people edit content, and CI runs it before the build.

## Islands and hydration

- Pages that must be indexable (`QuestionPage`, `QuestionIndex`, `GlossaryIndex`, `TopicTable`)
  use `client:load` and render real HTML on the server. `useProgress()` returns an empty state until
  mounted, so server HTML and the first client render always match.
- Purely personal or timed views (`DrillApp`, `MockRunner`, `MeDashboard`, `Flashcards`, `SearchApp`)
  use `client:only="react"` with a fallback.

## Offline (PWA)

`src/integrations/service-worker.mjs` runs after `astro build` and writes:

- `sw.js` from `src/integrations/sw-template.js`, with the hashed `_astro` assets, the question indexes
  and the offline page injected. Pages and data are network-first (fresh when online, cached copy offline);
  hashed assets are cache-first; Pagefind is network-only.
- `offline/<exam>.json` — the URL list and size of one exam. The 「オフライン用に保存」 button
  (`src/components/offline/OfflineButton.tsx`, `src/lib/offline.ts`) downloads it into the `sd-saved` cache.
  Single-question pages are not in the pack: offline, `/offline/` is served and renders the requested
  question from its JSON (`OfflineFallback.tsx`).

The manifest is a static endpoint (`src/pages/manifest.webmanifest.ts`) so its URLs follow the base path.
The worker is registered only in production builds.

## Extending

- **New exam**: add `src/content/exams/<id>.yaml` (and the family in `catalog.ts` if new). Every
  route under `/exams/<id>/` appears automatically.
- **New question format**: extend the discriminated union in `content.config.ts` and
  `domain/question.ts`, add a branch in `domain/grading.ts` (with tests), an input in
  `components/question/inputs.tsx`, and an answer rendering in `components/question/feedback.tsx`.
  TypeScript's exhaustive `switch` statements point at every place that needs a case.
- **Cloud sync**: implement `ProgressStorage` and pass it to `initProgress()`. `mergeProgress()`
  already resolves conflicts record by record (most recent wins; daily activity takes the maximum).
- **Formula sheet**: add `src/content/formulas/<exam>.yaml`; the 公式集 tab appears for that exam.
- **Roadmap**: set `tier` and `pathways` in the exam YAML; `/roadmap/` lays the graph out with
  `src/domain/roadmap.ts`.
- **Another UI language**: add `src/i18n/<locale>.ts` with the same shape as `ja.ts`.

## Deployment

`.github/workflows/deploy.yml` builds on every push to `main` and publishes `dist/` to GitHub Pages.
`SITE_URL` and `BASE_PATH` come from `actions/configure-pages`, so the same build works for a
project site (`/<repo>/`) and a custom domain. All internal links go through `src/lib/paths.ts`.
After `astro build`, Pagefind indexes pages marked `data-pagefind-body` into `dist/pagefind/`.
