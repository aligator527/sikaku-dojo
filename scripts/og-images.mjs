#!/usr/bin/env node
/**
 * Share images (Open Graph / X cards), 1200×630: public/og/default.png and public/og/<exam>.png.
 * Run `pnpm og` after adding or renaming an exam and commit the PNGs.
 *
 * Text is drawn by librsvg through fontconfig, so the machine needs the Noto CJK fonts
 * ("Noto Serif CJK JP" and "Noto Sans CJK JP"; e.g. `apt install fonts-noto-cjk`).
 * The seal reuses the outlined glyph in public/favicon.svg, so it needs no font.
 */
import { mkdirSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import YAML from 'yaml';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'public/og');
mkdirSync(out, { recursive: true });

const C = {
  paper: '#f6f4ee',
  ink: '#1e1d1a',
  ink2: '#4b4841',
  ink3: '#7a756b',
  rule: '#c3bcac',
  shu: '#c0432a',
  ai: '#1f4e79',
};
const SERIF = "'Noto Serif CJK JP', 'Noto Serif JP', serif";
const SANS = "'Noto Sans CJK JP', 'Noto Sans JP', sans-serif";

// Inner markup of the favicon (frame + outlined 道), placed as a nested 64×64 viewport.
const favicon = readFileSync(path.join(root, 'public/favicon.svg'), 'utf8');
const sealInner = favicon.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const seal = (x, y, size) =>
  `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 0 64 64">${sealInner}</svg>`;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const fit = (text, max, width) => Math.min(max, Math.floor(width / [...text].length));

function card({ eyebrow, title, subtitle, footer }) {
  const size = fit(title, 104, 1000);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${C.paper}"/>
  <rect x="0" y="0" width="1200" height="10" fill="${C.ink}"/>
  ${seal(80, 70, 76)}
  <text x="172" y="124" font-family="${SERIF}" font-weight="700" font-size="40" fill="${C.ink}" letter-spacing="6">資格道場</text>
  ${eyebrow ? `<text x="80" y="268" font-family="${SANS}" font-weight="700" font-size="30" fill="${C.ink3}">${esc(eyebrow)}</text>` : ''}
  <text x="76" y="${eyebrow ? 268 + size + 18 : 330}" font-family="${SERIF}" font-weight="700" font-size="${size}" fill="${C.ink}">${esc(title)}</text>
  <rect x="80" y="470" width="1040" height="2" fill="${C.ink}"/>
  <text x="80" y="528" font-family="${SANS}" font-size="${fit(subtitle, 30, 1040)}" fill="${C.ink2}">${esc(subtitle)}</text>
  <text x="80" y="576" font-family="${SANS}" font-size="${fit(footer, 24, 1040)}" fill="${C.ink3}">${esc(footer)}</text>
</svg>`;
}

const render = (svg, file) =>
  sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(path.join(out, file));

await render(
  card({
    eyebrow: '',
    title: '資格試験の問題演習',
    subtitle: '統計検定・E資格・ITストラテジスト・日商簿記・数検1級・中小企業診断士',
    footer: '過去問と練習問題の解説 ・ 模擬試験 ・ 用語集 ・ 公式集 ・ 付表',
  }),
  'default.png',
);

const examDir = path.join(root, 'src/content/exams');
const families = {
  toukei: '統計検定',
  suken: '実用数学技能検定',
  ipa: '情報処理技術者試験',
  jdla: 'JDLA',
  boki: '日商簿記検定',
  shindanshi: '中小企業診断士',
};
for (const file of readdirSync(examDir).filter((f) => f.endsWith('.yaml'))) {
  const exam = YAML.parse(readFileSync(path.join(examDir, file), 'utf8'));
  const id = path.basename(file, '.yaml');
  await render(
    card({
      eyebrow: families[exam.family] ?? '',
      title: exam.name,
      subtitle: '問題演習と解説 ・ 模擬試験 ・ 用語集 ・ 対策',
      footer: exam.format?.short ?? '',
    }),
    `${id}.png`,
  );
  console.log(`og/${id}.png`);
}
console.log('og/default.png');
