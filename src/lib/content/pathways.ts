import { getExams, type Exam } from './exams';

export interface Pathway {
  from: Exam;
  to: Exam;
  kind: 'next' | 'related';
  note: string;
}

/** Every pathway declared in exams/*.yaml, resolved to exam objects. */
export async function getPathways(): Promise<Pathway[]> {
  const exams = await getExams();
  const byId = new Map(exams.map((e) => [e.id, e]));
  return exams.flatMap((from) =>
    from.pathways
      .filter((p) => byId.has(p.to.id))
      .map((p) => ({ from, to: byId.get(p.to.id)!, kind: p.kind, note: p.note })),
  );
}

/** Pathways touching one exam, split by direction. "Related" is symmetric. */
export async function pathwaysOf(examId: string) {
  const all = await getPathways();
  return {
    next: all.filter((p) => p.kind === 'next' && p.from.id === examId),
    previous: all.filter((p) => p.kind === 'next' && p.to.id === examId),
    related: all
      .filter((p) => p.kind === 'related' && (p.from.id === examId || p.to.id === examId))
      .map((p) => (p.from.id === examId ? p : { ...p, from: p.to, to: p.from })),
  };
}
