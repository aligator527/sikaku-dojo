// @ts-check
/**
 * Markdown pipeline shared by Astro's content rendering (astro.config.mjs) and by
 * build-time rendering of front-matter fields such as question stems and choices
 * (src/lib/markdown/render.ts). Keeping one definition guarantees identical output.
 */
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

/** @type {import('@astrojs/markdown-remark').RemarkPlugins} */
export const remarkPlugins = [remarkMath];

/** @type {import('@astrojs/markdown-remark').RehypePlugins} */
export const rehypePlugins = [[rehypeKatex, { strict: false, output: 'htmlAndMathml' }]];

/** @type {import('@astrojs/markdown-remark').ShikiConfig} */
export const shikiConfig = {
  themes: { light: 'github-light', dark: 'github-dark-dimmed' },
  defaultColor: false,
  wrap: true,
};

/** Options for createMarkdownProcessor(). SmartyPants is off: it mangles Japanese quotes and code. */
export const markdownOptions = {
  gfm: true,
  smartypants: false,
  remarkPlugins,
  rehypePlugins,
  syntaxHighlight: /** @type {const} */ ('shiki'),
  shikiConfig,
};
