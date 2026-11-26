# 資格道場 — notes for coding agents

- Read `docs/ARCHITECTURE.md` (code layout, data flow) and `docs/CONTENT_GUIDE.md` (content formats, copyright rules) first.
- Content lives in `src/content/`; validate with `pnpm sync` (schemas) and `pnpm build` (cross-file integrity).
- Domain logic in `src/domain/` must stay framework-free and covered by `pnpm test`.
- All internal links go through `src/lib/paths.ts` (the site is served under a base path on GitHub Pages).
- UI copy goes in `src/i18n/ja.ts`. No emoji in the UI; icons come from Lucide (`@lucide/astro`, `lucide-react`).
- Dev server: `astro dev --background`; manage with `astro dev stop|status|logs`.
