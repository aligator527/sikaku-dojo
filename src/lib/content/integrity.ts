/**
 * Cross-file checks that a per-file zod schema cannot express:
 * references between collections, topic ids, answer indices, balanced journals.
 * Runs once per build; every problem is reported together so authors fix them in one pass.
 */
import { getCollection } from 'astro:content';

let checked: Promise<void> | undefined;

export function assertContentIntegrity(): Promise<void> {
  checked ??= run();
  return checked;
}

async function run(): Promise<void> {
  const [exams, questions, glossary, guides, resources, mocks, formulas] = await Promise.all([
    getCollection('exams'),
    getCollection('questions'),
    getCollection('glossary'),
    getCollection('guides'),
    getCollection('resources'),
    getCollection('mocks'),
    getCollection('formulas'),
  ]);

  const errors: string[] = [];
  const examById = new Map(exams.map((e) => [e.id, e.data]));
  const termIds = new Set(glossary.map((g) => g.id));
  const questionIds = new Set(questions.map((q) => q.id));
  const fail = (where: string, message: string) => errors.push(`${where}: ${message}`);
  const requireExam = (where: string, id: string) => {
    if (!examById.has(id)) fail(where, `unknown exam "${id}"`);
    return examById.get(id);
  };

  for (const e of exams) {
    const dup = (ids: string[]) => ids.filter((id, i) => ids.indexOf(id) !== i);
    for (const id of dup(e.data.topics.map((t) => t.id))) fail(`exams/${e.id}`, `duplicate topic "${id}"`);
    for (const id of dup(e.data.sections.map((s) => s.id)))
      fail(`exams/${e.id}`, `duplicate section "${id}"`);
  }

  for (const q of questions) {
    const where = `questions/${q.id}`;
    const d = q.data;
    const exam = requireExam(where, d.exam.id);
    if (!q.id.startsWith(`${d.exam.id}/`)) fail(where, `file must live in questions/${d.exam.id}/`);
    if (!exam) continue;
    for (const t of d.topics) {
      if (!exam.topics.some((x) => x.id === t))
        fail(where, `topic "${t}" is not defined in exams/${d.exam.id}`);
    }
    if (d.section && !exam.sections.some((s) => s.id === d.section)) {
      fail(where, `section "${d.section}" is not defined in exams/${d.exam.id}`);
    }
    if (d.format === 'single' && d.answer > d.choices.length)
      fail(where, `answer ${d.answer} is out of range`);
    if (d.format === 'multiple') {
      for (const a of d.answer) if (a > d.choices.length) fail(where, `answer ${a} is out of range`);
    }
    if (d.format === 'journal') {
      const sum = (lines: { amount: number }[]) => lines.reduce((s, l) => s + l.amount, 0);
      if (sum(d.answer.debit) !== sum(d.answer.credit)) fail(where, 'debit and credit totals differ');
      for (const line of [...d.answer.debit, ...d.answer.credit]) {
        if (!d.accounts.includes(line.account))
          fail(where, `account "${line.account}" missing from accounts`);
      }
    }
  }

  for (const g of glossary) {
    const where = `glossary/${g.id}`;
    for (const e of g.data.exams) requireExam(where, e.id);
    for (const r of g.data.related)
      if (!termIds.has(r.id)) fail(where, `related term "${r.id}" does not exist`);
  }

  for (const g of guides) {
    requireExam(`guides/${g.id}`, g.data.exam.id);
    if (g.id !== g.data.exam.id)
      fail(`guides/${g.id}`, `file name must equal the exam id "${g.data.exam.id}"`);
  }

  for (const r of resources) {
    for (const item of r.data.items)
      for (const e of item.exams) requireExam(`resources/${r.id} (${item.title})`, e.id);
  }

  for (const m of mocks) {
    const where = `mocks/${m.id}`;
    const exam = requireExam(where, m.data.exam.id);
    if (!exam) continue;
    for (const q of m.data.questions ?? []) {
      if (!questionIds.has(q.id)) fail(where, `question "${q.id}" does not exist`);
      else if (!q.id.startsWith(`${m.data.exam.id}/`))
        fail(where, `question "${q.id}" belongs to another exam`);
    }
    for (const row of m.data.blueprint ?? []) {
      for (const t of row.topics ?? []) {
        if (!exam.topics.some((x) => x.id === t)) fail(where, `blueprint topic "${t}" is not defined`);
      }
      for (const sec of row.sections ?? []) {
        if (!exam.sections.some((x) => x.id === sec))
          fail(where, `blueprint section "${sec}" is not defined`);
      }
    }
  }

  for (const f of formulas) {
    const where = `formulas/${f.id}`;
    const exam = requireExam(where, f.data.exam.id);
    if (f.id !== f.data.exam.id) fail(where, `file name must equal the exam id "${f.data.exam.id}"`);
    if (!exam) continue;
    for (const section of f.data.sections) {
      for (const t of section.topics)
        if (!exam.topics.some((x) => x.id === t))
          fail(where, `topic "${t}" is not defined in exams/${f.data.exam.id}`);
      for (const item of section.items)
        if (item.term && !termIds.has(item.term)) fail(where, `glossary term "${item.term}" does not exist`);
    }
  }

  for (const e of exams) {
    for (const p of e.data.pathways) {
      if (!examById.has(p.to.id)) fail(`exams/${e.id}`, `pathway to unknown exam "${p.to.id}"`);
      if (p.to.id === e.id) fail(`exams/${e.id}`, 'pathway points to itself');
    }
  }

  if (errors.length > 0) {
    const report = `Content integrity check failed (${errors.length}):\n  - ${errors.join('\n  - ')}`;
    // In `astro dev` keep pages viewable while an author is mid-edit; a build always fails.
    if (import.meta.env.DEV) console.warn(report);
    else throw new Error(report);
  }
}
