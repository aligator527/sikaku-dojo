/** Plain-text preview of a Markdown stem for lists and meta descriptions. */
export function excerpt(markdown: string, max = 72): string {
  const text = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/\$\$[\s\S]*?\$\$/g, '〔式〕')
    .replace(/\$[^$\n]+\$/g, '〔式〕')
    .replace(/^\s*\|.*\|\s*$/gm, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~]/g, '')
    .replace(/^\s*[-+]\s+/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
  return [...text].length > max ? `${[...text].slice(0, max).join('')}…` : text;
}
