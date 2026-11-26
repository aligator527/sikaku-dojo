/**
 * Build-time Markdown → HTML for front-matter fields (stems, choices, model answers).
 * Uses the exact same plugin set as Astro's own content rendering.
 */
import { createMarkdownProcessor, type MarkdownRenderer } from '@astrojs/markdown-remark';

import { markdownOptions } from './options.mjs';

let processor: Promise<MarkdownRenderer> | undefined;
const cache = new Map<string, Promise<string>>();

export function renderMarkdown(markdown: string): Promise<string> {
  let html = cache.get(markdown);
  if (!html) {
    processor ??= createMarkdownProcessor(markdownOptions);
    html = processor.then((p) => p.render(markdown)).then((r) => r.code);
    cache.set(markdown, html);
  }
  return html;
}

/** For short fragments (answer choices): unwraps a lone paragraph so it can sit inline. */
export async function renderInline(markdown: string): Promise<string> {
  const html = (await renderMarkdown(markdown)).trim();
  const single = /^<p>([\s\S]*)<\/p>$/.exec(html);
  return single && !single[1]!.includes('<p>') ? single[1]! : html;
}
