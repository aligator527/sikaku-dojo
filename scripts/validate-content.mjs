#!/usr/bin/env node
/**
 * Fast, standalone content linter. It needs no Astro build, so it is safe to run while a
 * dev server is up or while several authors work in parallel.
 *
 * It repeats the essentials of the zod schema and the integrity pass (src/lib/content/integrity.ts)
 * and adds checks neither can do: TeX that KaTeX refuses to compile, choice labels typed into
 * choice text, emoji, TeX inside double-quoted YAML, unknown keys, duplicated stems.
 *
 *   node scripts/validate-content.mjs                    # all content
 *   node scripts/validate-content.mjs --exam toukei-2    # one exam (questions + formula sheet)
 *   node scripts/validate-content.mjs --glossary         # every glossary term
 *   node scripts/validate-content.mjs path/to/a.md …     # specific files
 *   add --quiet to hide warnings
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contentDir = path.join(root, 'src/content');
// Compile with the KaTeX build rehype-katex uses, so this check matches the site exactly.
const katex = createRequire(import.meta.resolve('rehype-katex'))('katex');

/* ------------------------------- CLI ------------------------------- */

const args = process.argv.slice(2);
const quiet = args.includes('--quiet');
const examFilter = args.includes('--exam') ? args[args.indexOf('--exam') + 1] : undefined;
const glossaryOnly = args.includes('--glossary');
const explicitFiles = args.filter(
  (a, i) => !a.startsWith('--') && args[i - 1] !== '--exam' && /\.(md|ya?ml)$/.test(a),
);

/* ----------------------------- reporting ----------------------------- */

const problems = [];
const rel = (file) => path.relative(root, file);
const error = (file, msg) => problems.push({ level: 'error', file: rel(file), msg });
const warn = (file, msg) => problems.push({ level: 'warn', file: rel(file), msg });

/* ------------------------------ loading ------------------------------ */

const listFiles = (dir, re) =>
  existsSync(dir)
    ? readdirSync(dir, { recursive: true })
        .map((f) => path.join(dir, String(f)))
        .filter((f) => re.test(f) && statSync(f).isFile())
        .sort()
    : [];

function parseYaml(file, source) {
  const doc = YAML.parseDocument(source, { prettyErrors: true });
  if (doc.errors.length) {
    for (const e of doc.errors) error(file, `YAML: ${e.message.split('\n')[0]}`);
    return undefined;
  }
  // In "double quoted" YAML, \f \n \t … are escapes, so TeX like "\frac" silently breaks.
  YAML.visit(doc, {
    Scalar(_, node) {
      if (node.type === 'QUOTE_DOUBLE' && node.range) {
        const raw = source.slice(node.range[0], node.range[1]);
        if (raw.includes('\\'))
          error(file, `backslash inside a double-quoted YAML string (${raw.slice(0, 40)}…); use '…' or |`);
      }
    },
  });
  return doc.toJS();
}

function readMarkdown(file) {
  const text = readFileSync(file, 'utf8');
  const m = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n([\s\S]*))?$/.exec(text);
  if (!m) {
    error(file, 'missing front matter (--- … ---)');
    return undefined;
  }
  const data = parseYaml(file, m[1]);
  return data === undefined ? undefined : { data: data ?? {}, body: m[2] ?? '' };
}

const exams = new Map(
  listFiles(path.join(contentDir, 'exams'), /\.yaml$/).map((f) => [
    path.basename(f, '.yaml'),
    YAML.parse(readFileSync(f, 'utf8')),
  ]),
);
const glossaryIds = new Set(
  listFiles(path.join(contentDir, 'glossary'), /\.md$/).map((f) => path.basename(f, '.md')),
);

/* ------------------------------ helpers ------------------------------ */

/** Math in the same places remark-math finds it: $$display$$ and $inline$, outside code. */
function checkMath(file, field, markdown) {
  if (typeof markdown !== 'string' || !markdown.includes('$')) return;
  let text = markdown.replace(/^(```|~~~)[^\n]*\n[\s\S]*?^\1[ \t]*$/gm, ' ').replace(/`[^`\n]+`/g, ' ');
  const segments = [];
  text = text.replace(/\$\$([\s\S]+?)\$\$/g, (_, tex) => (segments.push({ tex, display: true }), ' '));
  text = text.replace(
    /(?<!\\)\$((?:\\.|[^$\\\n])+?)\$/g,
    (_, tex) => (segments.push({ tex, display: false }), ' '),
  );
  if (/(?<!\\)\$/.test(text)) warn(file, `${field}: unmatched "$" (escape a literal dollar as \\$)`);
  for (const { tex, display } of segments) {
    try {
      katex.renderToString(tex, { displayMode: display, throwOnError: true, strict: 'ignore' });
    } catch (e) {
      const reason = String(e.message ?? e).replace(/^KaTeX parse error: /, '');
      error(file, `${field}: KaTeX cannot compile "${tex.trim().slice(0, 60)}" — ${reason.slice(0, 120)}`);
    }
  }
}

function checkTex(file, field, tex) {
  try {
    katex.renderToString(tex, { displayMode: true, throwOnError: true, strict: 'ignore' });
  } catch (e) {
    error(file, `${field}: KaTeX cannot compile "${tex.slice(0, 60)}" — ${String(e.message).slice(0, 120)}`);
  }
}

// Characters drawn as emoji by default, plus the variation selector that forces emoji style.
// (Extended_Pictographic would also flag ↔ and ®, which are ordinary text here.)
const EMOJI = /[\p{Emoji_Presentation}\u{1F000}-\u{1FAFF}\uFE0F]/u;
function checkText(file, field, value) {
  if (typeof value !== 'string') return;
  if (EMOJI.test(value)) error(file, `${field}: contains an emoji`);
  checkMath(file, field, value);
}

const isInt = (n) => Number.isInteger(n);
const isUrl = (s) => {
  try {
    return Boolean(new URL(s));
  } catch {
    return false;
  }
};

/* ----------------------------- questions ----------------------------- */

const BASE_KEYS = [
  'exam',
  'section',
  'topics',
  'source',
  'difficulty',
  'points',
  'order',
  'passage',
  'stem',
  'tags',
  'format',
];
const FORMAT_KEYS = {
  single: ['choices', 'answer'],
  multiple: ['choices', 'answer'],
  numeric: ['answer', 'inputHint'],
  journal: ['accounts', 'answer'],
  table: ['accounts', 'tables'],
  essay: ['modelAnswer', 'rubric', 'charLimit'],
};
// A label typed into the choice text would be shown twice (labels are added by choiceStyle).
const LABEL_PREFIX =
  /^\s*(?:[ア-オ][\s.．、:：)）]|[(（][ア-オa-eA-E1-9][)）]|[a-eA-E][.．:：)）]\s|[1-9][.．:：)）]\s)/u;
// o-001 / a-001, or IPA past papers: 2024-spring-am2-01, 2024-spring-pm1-02-3-1 (問2 設問3 (1))
const SLUG = /^(?:[oa]-\d{3}|\d{4}-(?:spring|autumn)-(?:am1|am2|pm1|pm2)-\d{2}(?:-\d{1,2}){0,2})$/;
const IPA_LABEL =
  /^(?:令和|平成)(?:\d+|元)年度 (?:春期|秋期|特別) .+ (?:午前I|午前II|午後I|午後II) 問\d+(?: 設問\d+(?:\(\d+\))?)?$/u;

const stemsByExam = new Map();

function checkQuestion(file) {
  const parsed = readMarkdown(file);
  if (!parsed) return;
  const { data: q, body } = parsed;
  const folder = path.basename(path.dirname(file));
  const slug = path.basename(file, '.md');

  if (q.exam !== folder) error(file, `exam "${q.exam}" must match the folder "${folder}"`);
  const exam = exams.get(q.exam);
  if (!exam) return error(file, `unknown exam "${q.exam}"`);
  if (!SLUG.test(slug)) warn(file, `file name "${slug}" does not follow o-001 / 2023-spring-am2-01`);

  const format = q.format;
  if (!FORMAT_KEYS[format]) return error(file, `unknown format "${format}"`);
  for (const key of Object.keys(q)) {
    if (!BASE_KEYS.includes(key) && !FORMAT_KEYS[format].includes(key))
      error(file, `unknown key "${key}" for format ${format}`);
  }

  // where it belongs
  if (!Array.isArray(q.topics) || q.topics.length === 0) error(file, 'topics must be a non-empty list');
  for (const t of q.topics ?? [])
    if (!exam.topics.some((x) => x.id === t)) error(file, `topic "${t}" is not defined in exams/${q.exam}`);
  if (q.section !== undefined && !(exam.sections ?? []).some((s) => s.id === q.section))
    error(file, `section "${q.section}" is not defined in exams/${q.exam}`);
  if (q.difficulty !== undefined && ![1, 2, 3].includes(q.difficulty))
    error(file, 'difficulty must be 1, 2 or 3');
  if (q.points !== undefined && !(typeof q.points === 'number' && q.points > 0))
    error(file, 'points must be > 0');
  if (q.tags !== undefined && !Array.isArray(q.tags)) error(file, 'tags must be a list');

  // source and copyright
  const src = q.source;
  if (!src || !['past', 'adapted', 'original'].includes(src.kind))
    error(file, 'source.kind must be past | adapted | original');
  else {
    if (src.kind !== 'original' && !src.label) error(file, `${src.kind} questions need source.label (出典)`);
    if (src.url !== undefined && !isUrl(src.url)) error(file, `source.url is not a URL`);
    if (src.kind === 'past' && exam.family !== 'ipa')
      error(
        file,
        'only IPA questions may be reproduced verbatim (source.kind: past); use adapted or original',
      );
    if (src.kind === 'past' && src.label && !IPA_LABEL.test(src.label))
      warn(
        file,
        `source.label "${src.label}" should look like 令和5年度 春期 ITストラテジスト試験 午前II 問1`,
      );
  }

  // text
  if (typeof q.stem !== 'string' || !q.stem.trim()) error(file, 'stem is empty');
  checkText(file, 'stem', q.stem);
  checkText(file, 'passage', q.passage);
  checkText(file, 'inputHint', q.inputHint);
  checkText(file, 'explanation', body);
  if (body.trim().length < 80) warn(file, 'explanation (body) is very short');

  // answer
  if (format === 'single' || format === 'multiple') {
    const choices = q.choices;
    if (!Array.isArray(choices) || choices.length < 2) return error(file, 'choices needs at least 2 items');
    choices.forEach((c, i) => {
      if (typeof c !== 'string' || !c.trim()) error(file, `choice ${i + 1} is empty or not a string`);
      else {
        checkText(file, `choice ${i + 1}`, c);
        // "(ア) A　(イ) B" is a combination choice, not a stray label.
        const combination = (c.match(/[(（][ア-オa-eA-EI-V1-9]+[)）]/gu) ?? []).length >= 2;
        if (LABEL_PREFIX.test(c) && !combination)
          warn(file, `choice ${i + 1} seems to start with a label: "${c.slice(0, 12)}"`);
      }
    });
    const normalized = choices.map((c) => String(c).replace(/\s+/g, ''));
    if (new Set(normalized).size !== normalized.length) error(file, 'two choices are identical');
    if (choices.length > 6) warn(file, `${choices.length} choices — unusually many`);
    const answers = format === 'single' ? [q.answer] : q.answer;
    if (format === 'single' && !isInt(q.answer)) error(file, 'answer must be a 1-based integer');
    if (format === 'multiple' && (!Array.isArray(q.answer) || q.answer.length === 0))
      error(file, 'answer must be a non-empty list');
    for (const a of answers ?? [])
      if (!isInt(a) || a < 1 || a > choices.length) error(file, `answer ${a} is out of range`);
    if (format === 'multiple' && new Set(q.answer).size !== q.answer.length)
      error(file, 'answer has duplicates');
  }

  if (format === 'numeric') {
    const a = q.answer;
    if (!a || typeof a.value !== 'number' || !Number.isFinite(a.value))
      error(file, 'answer.value must be a number');
    else {
      const tol = a.tolerance ?? 0;
      if (typeof tol !== 'number' || tol < 0) error(file, 'answer.tolerance must be ≥ 0');
      if (tol === 0 && !isInt(a.value))
        warn(file, 'non-integer answer with tolerance 0 — learners must type it exactly');
      if (tol > 0 && Math.abs(a.value) > 0 && tol / Math.abs(a.value) > 0.05)
        warn(file, `tolerance ${tol} is more than 5% of the answer ${a.value}`);
    }
    if (a?.unit !== undefined && typeof a.unit !== 'string') error(file, 'answer.unit must be a string');
  }

  if (format === 'journal') {
    const accounts = q.accounts;
    if (!Array.isArray(accounts) || accounts.length < 2) error(file, 'accounts needs at least 2 items');
    else if (new Set(accounts).size !== accounts.length) error(file, 'accounts has duplicates');
    const sides = ['debit', 'credit'];
    let lines = 0;
    const totals = sides.map((side) => {
      const list = q.answer?.[side];
      if (!Array.isArray(list) || list.length === 0) {
        error(file, `answer.${side} needs at least one line`);
        return 0;
      }
      lines += list.length;
      return list.reduce((sum, l) => {
        if (!accounts?.includes(l.account)) error(file, `account "${l.account}" is not in accounts`);
        if (!isInt(l.amount) || l.amount <= 0)
          error(file, `${side} amount ${l.amount} must be a positive integer`);
        return sum + (Number(l.amount) || 0);
      }, 0);
    });
    if (totals[0] !== totals[1]) error(file, `debit total ${totals[0]} ≠ credit total ${totals[1]}`);
    if (Array.isArray(accounts) && accounts.length < lines + 2)
      warn(file, 'accounts offers almost no distractors (add plausible wrong accounts)');
  }

  if (format === 'table') checkTables(file, q);

  if (format === 'essay') {
    if (typeof q.modelAnswer !== 'string' || !q.modelAnswer.trim()) error(file, 'modelAnswer is empty');
    checkText(file, 'modelAnswer', q.modelAnswer);
    if (q.rubric !== undefined && !Array.isArray(q.rubric)) error(file, 'rubric must be a list');
    (q.rubric ?? []).forEach((r, i) => checkText(file, `rubric ${i + 1}`, r));
    if (q.charLimit !== undefined && !(isInt(q.charLimit) && q.charLimit > 0))
      error(file, 'charLimit must be a positive integer');
  }

  // duplicates inside one exam
  if (typeof q.stem === 'string') {
    const key = (q.passage ?? '') + q.stem.replace(/\s+/g, '');
    const seen = stemsByExam.get(q.exam) ?? new Map();
    if (seen.has(key)) error(file, `same stem as ${seen.get(key)}`);
    seen.set(key, slug);
    stemsByExam.set(q.exam, seen);
  }
}

/* ---------------------------- answer tables ---------------------------- */

const isAnswerBox = (c) => c !== null && typeof c === 'object' && !Array.isArray(c) && 'ans' in c;

/** Table questions (format: table): shape, widths, answers and choices. */
function checkTables(file, q) {
  const accounts = q.accounts;
  if (accounts !== undefined) {
    if (!Array.isArray(accounts) || accounts.length < 2) error(file, 'accounts needs at least 2 items');
    else if (new Set(accounts).size !== accounts.length) error(file, 'accounts has duplicates');
  }
  if (!Array.isArray(q.tables) || q.tables.length === 0)
    return error(file, 'tables needs at least one table');
  let scored = 0;
  q.tables.forEach((table, ti) => {
    const w = `table ${ti + 1}`;
    if (!table || typeof table !== 'object') return error(file, `${w} is not an object`);
    for (const key of Object.keys(table))
      if (!['caption', 'head', 'rows'].includes(key)) error(file, `${w}: unknown key "${key}"`);
    checkText(file, `${w} caption`, table.caption);
    const head = table.head ?? [];
    const headRows = head.length && Array.isArray(head[0]) ? head : head.length ? [head] : [];
    const widthOf = (row) =>
      row.reduce((n, c) => n + (typeof c === 'object' && c !== null ? (c.span ?? 1) : 1), 0);
    const headWidths = headRows.map(widthOf);
    if (new Set(headWidths).size > 1) error(file, `${w}: header rows have different widths (${headWidths})`);
    headRows.flat().forEach((c) => checkText(file, `${w} header`, typeof c === 'string' ? c : c?.text));
    if (!Array.isArray(table.rows) || table.rows.length === 0) return error(file, `${w}: rows is empty`);
    const width = headWidths[0] ?? table.rows[0].length;
    table.rows.forEach((row, ri) => {
      const r = `${w} row ${ri + 1}`;
      if (!Array.isArray(row)) return error(file, `${r} is not a list`);
      if (row.length !== width) error(file, `${r} has ${row.length} cells, expected ${width}`);
      row.forEach((c, ci) => {
        const where = `${r} cell ${ci + 1}`;
        if (c === null) return; // a box that must stay empty
        if (typeof c === 'string') return checkText(file, where, c);
        if (typeof c === 'number')
          return Number.isFinite(c) || error(file, `${where} is not a finite number`);
        if (!isAnswerBox(c)) return error(file, `${where}: use text, a number, ~ (empty box) or { ans: … }`);
        for (const key of Object.keys(c))
          if (!['ans', 'tol', 'pre'].includes(key)) error(file, `${where}: unknown key "${key}"`);
        if (c.pre !== undefined && (typeof c.pre !== 'string' || c.pre.length > 4))
          error(file, `${where}: pre must be a short text such as △`);
        const a = c.ans;
        if (a === null) return;
        scored += 1;
        if (typeof a === 'number') {
          if (!Number.isFinite(a)) error(file, `${where}: ans is not a finite number`);
          if (c.tol !== undefined && !(typeof c.tol === 'number' && c.tol >= 0))
            error(file, `${where}: tol must be ≥ 0`);
          return;
        }
        const texts = typeof a === 'string' ? [a] : a;
        if (
          !Array.isArray(texts) ||
          texts.length === 0 ||
          texts.some((x) => typeof x !== 'string' || !x.trim())
        )
          return error(file, `${where}: ans must be a number, a non-empty text, a list of texts or null`);
        if (c.tol !== undefined) error(file, `${where}: tol only applies to numbers`);
        if (Array.isArray(accounts) && !texts.some((x) => accounts.includes(x)))
          error(file, `${where}: "${texts[0]}" is not in accounts (text boxes are chosen from accounts)`);
      });
    });
  });
  if (scored === 0) error(file, 'tables have no box to fill in ({ ans: … })');
  if (scored > 80) warn(file, `${scored} boxes to fill in — consider splitting the question`);
}

/* ------------------------------ formulas ------------------------------ */

function checkFormulaSheet(file) {
  const data = parseYaml(file, readFileSync(file, 'utf8'));
  if (!data) return;
  const examId = path.basename(file, '.yaml');
  const exam = exams.get(data.exam);
  if (!exam) return error(file, `unknown exam "${data.exam}"`);
  if (data.exam !== examId) error(file, `file name must equal the exam id "${data.exam}"`);
  if (!data.title) error(file, 'title is required');
  checkText(file, 'intro', data.intro);
  if (!Array.isArray(data.sections) || data.sections.length === 0)
    return error(file, 'sections must be a non-empty list');
  data.sections.forEach((s, i) => {
    const where = `sections[${i}]`;
    if (!s.title) error(file, `${where}.title is required`);
    for (const t of s.topics ?? [])
      if (!exam.topics.some((x) => x.id === t))
        error(file, `${where}: topic "${t}" is not defined in exams/${data.exam}`);
    if (!Array.isArray(s.items) || s.items.length === 0)
      return error(file, `${where}.items must be a non-empty list`);
    s.items.forEach((item, j) => {
      const w = `${where}.items[${j}]`;
      for (const key of Object.keys(item))
        if (!['name', 'tex', 'note', 'term'].includes(key)) error(file, `${w}: unknown key "${key}"`);
      if (!item.name) error(file, `${w}.name is required`);
      if (typeof item.tex !== 'string' || !item.tex.trim()) error(file, `${w}.tex is required`);
      else checkTex(file, `${w}.tex`, item.tex);
      checkText(file, `${w}.note`, item.note);
      if (item.term && !glossaryIds.has(item.term))
        error(file, `${w}: glossary term "${item.term}" does not exist`);
    });
  });
}

/* ------------------------------ glossary ------------------------------ */

const GLOSSARY_KEYS = ['term', 'reading', 'en', 'aliases', 'exams', 'summary', 'related', 'formula'];
const READING = /^[ぁ-ゟー・ ]+$/u;
const SLUG_KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Every term name and alias → the slugs that claim it (case-sensitive, like the matcher: mAP ≠ MAP). */
const namesInGlossary = new Map();
for (const f of listFiles(path.join(contentDir, 'glossary'), /\.md$/)) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(readFileSync(f, 'utf8'));
  let data;
  try {
    data = m ? YAML.parse(m[1]) : undefined;
  } catch {
    continue; // reported when the file itself is checked
  }
  const slug = path.basename(f, '.md');
  for (const name of [data?.term, ...(Array.isArray(data?.aliases) ? data.aliases : [])]) {
    if (typeof name !== 'string' || !name.trim()) continue;
    const key = name.normalize('NFKC').replace(/\s+/g, '');
    namesInGlossary.set(key, [...(namesInGlossary.get(key) ?? []), slug]);
  }
}

function checkGlossary(file) {
  const parsed = readMarkdown(file);
  if (!parsed) return;
  const { data, body } = parsed;
  const slug = path.basename(file, '.md');
  if (!SLUG_KEBAB.test(slug)) error(file, `file name must be English kebab-case (got "${slug}")`);
  for (const key of Object.keys(data)) if (!GLOSSARY_KEYS.includes(key)) error(file, `unknown key "${key}"`);

  if (typeof data.term !== 'string' || !data.term.trim()) error(file, 'term is required');
  if (typeof data.reading !== 'string' || !READING.test(data.reading))
    error(file, `reading must be hiragana (got "${data.reading}")`);
  if (data.en !== undefined && typeof data.en !== 'string') error(file, 'en must be a string');
  if (
    data.aliases !== undefined &&
    !(Array.isArray(data.aliases) && data.aliases.every((a) => typeof a === 'string'))
  )
    error(file, 'aliases must be a list of strings');
  if (!Array.isArray(data.exams) || data.exams.length === 0) error(file, 'exams must list at least one exam');
  else for (const e of data.exams) if (!exams.has(e)) error(file, `exam "${e}" does not exist`);
  if (typeof data.summary !== 'string' || !data.summary.trim()) error(file, 'summary is required');
  else if (data.summary.length > 160)
    warn(file, `summary is long (${data.summary.length} chars; aim for one sentence)`);
  if (data.related !== undefined) {
    if (!Array.isArray(data.related)) error(file, 'related must be a list of slugs');
    else
      for (const r of data.related) {
        if (r === slug) error(file, 'related lists the term itself');
        else if (!glossaryIds.has(r)) error(file, `related term "${r}" does not exist`);
      }
  }
  if (data.formula !== undefined) {
    if (typeof data.formula !== 'string') error(file, 'formula must be a string');
    else checkTex(file, 'formula', data.formula);
  }

  for (const name of [data.term, ...(Array.isArray(data.aliases) ? data.aliases : [])]) {
    if (typeof name !== 'string') continue;
    const others = (namesInGlossary.get(name.normalize('NFKC').replace(/\s+/g, '')) ?? []).filter(
      (s) => s !== slug,
    );
    if (others.length) error(file, `"${name}" is already the term or an alias of ${others.join(', ')}`);
  }

  if (body.trim().length < 200) warn(file, `body is short (${body.trim().length} chars)`);
  if (/^# /m.test(body)) error(file, 'body must not contain an h1 (# …); the page title is the term');
  if (/^### /m.test(body) && !/^## /m.test(body)) warn(file, 'use ## for the top-level sections of the body');
  if (/\]\((?:\/|\.\.?\/)/.test(body))
    error(file, 'internal links break under the base path; do not link inside the body');
  checkText(file, 'body', body);
  checkText(file, 'summary', data.summary);
}

/* --------------------------- other markdown --------------------------- */

function checkProse(file) {
  const parsed = readMarkdown(file);
  if (!parsed) return;
  checkText(file, 'body', parsed.body);
  if (typeof parsed.data.formula === 'string') checkTex(file, 'formula', parsed.data.formula);
  checkText(file, 'summary', parsed.data.summary);
}

/* -------------------------------- run -------------------------------- */

function route(file) {
  const r = path.relative(contentDir, path.resolve(file));
  if (r.startsWith('questions')) return checkQuestion(path.resolve(file));
  if (r.startsWith('formulas')) return checkFormulaSheet(path.resolve(file));
  if (r.startsWith('glossary')) return checkGlossary(path.resolve(file));
  if (r.startsWith('guides')) return checkProse(path.resolve(file));
}

let files;
if (explicitFiles.length) files = explicitFiles;
else if (glossaryOnly) files = listFiles(path.join(contentDir, 'glossary'), /\.md$/);
else if (examFilter) {
  if (!exams.has(examFilter)) {
    console.error(`unknown exam "${examFilter}"`);
    process.exit(2);
  }
  files = [
    ...listFiles(path.join(contentDir, 'questions', examFilter), /\.md$/),
    ...listFiles(path.join(contentDir, 'formulas'), new RegExp(`${examFilter}\\.yaml$`)),
  ];
} else {
  files = [
    ...listFiles(path.join(contentDir, 'questions'), /\.md$/),
    ...listFiles(path.join(contentDir, 'formulas'), /\.yaml$/),
    ...listFiles(path.join(contentDir, 'glossary'), /\.md$/),
    ...listFiles(path.join(contentDir, 'guides'), /\.md$/),
  ];
}

// Duplicate detection needs every question of the exam, even when only some files were named.
if (explicitFiles.length) {
  const folders = new Set(
    explicitFiles.filter((f) => f.includes(`questions${path.sep}`)).map((f) => path.dirname(path.resolve(f))),
  );
  const named = new Set(explicitFiles.map((f) => path.resolve(f)));
  for (const dir of folders)
    for (const f of listFiles(dir, /\.md$/))
      if (!named.has(f)) {
        const parsed = readMarkdown(f);
        if (parsed?.data?.stem && parsed.data.exam) {
          const seen = stemsByExam.get(parsed.data.exam) ?? new Map();
          seen.set(
            (parsed.data.passage ?? '') + String(parsed.data.stem).replace(/\s+/g, ''),
            path.basename(f, '.md'),
          );
          stemsByExam.set(parsed.data.exam, seen);
        }
      }
}

for (const f of files) route(f);

const errors = problems.filter((p) => p.level === 'error');
const warnings = problems.filter((p) => p.level === 'warn');
for (const p of quiet ? errors : problems)
  console.log(`${p.level === 'error' ? 'ERROR' : 'warn '}  ${p.file}  ${p.msg}`);
console.log(`\n${files.length} files checked: ${errors.length} errors, ${warnings.length} warnings`);
process.exit(errors.length ? 1 : 0);
