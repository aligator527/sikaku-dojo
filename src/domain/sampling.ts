/**
 * Deterministic randomness for drills and mock exams.
 * A seed makes a session reproducible (e.g. "today's question" or resuming a mock).
 */

export type Rng = () => number;

/** mulberry32 — tiny, fast, good enough for shuffling study questions. */
export function createRng(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Stable 32-bit hash of a string (FNV-1a) — turns dates or ids into seeds. */
export function hashSeed(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export function shuffle<T>(items: readonly T[], rng: Rng): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

export interface BlueprintRow {
  topics?: string[];
  /** Only questions from these sections (e.g. 午前II). Omit for any section. */
  sections?: string[];
  /** Only these question formats (e.g. essay for a 論述 paper). Omit for any format. */
  formats?: string[];
  count: number;
}

interface Topical {
  id: string;
  topics: string[];
  section?: string;
  format?: string;
}

/**
 * Draws questions row by row. Earlier rows win when topics overlap, a question is never
 * used twice, and a row that cannot be filled simply contributes what exists.
 */
export function drawFromBlueprint<T extends Topical>(
  pool: readonly T[],
  blueprint: BlueprintRow[],
  rng: Rng,
): T[] {
  const used = new Set<string>();
  const picked: T[] = [];
  for (const row of blueprint) {
    const wanted = row.topics && row.topics.length > 0 ? new Set(row.topics) : null;
    const sections = row.sections && row.sections.length > 0 ? new Set(row.sections) : null;
    const formats = row.formats && row.formats.length > 0 ? new Set(row.formats) : null;
    const candidates = pool.filter(
      (q) =>
        !used.has(q.id) &&
        (!wanted || q.topics.some((t) => wanted.has(t))) &&
        (!sections || (q.section !== undefined && sections.has(q.section))) &&
        (!formats || (q.format !== undefined && formats.has(q.format))),
    );
    for (const q of shuffle(candidates, rng).slice(0, row.count)) {
      used.add(q.id);
      picked.push(q);
    }
  }
  return picked;
}

/** The same question for everyone on a given day, per exam. */
export function pickDaily<T>(items: readonly T[], dateKey: string, salt = ''): T | undefined {
  if (items.length === 0) return undefined;
  return items[hashSeed(`${dateKey}:${salt}`) % items.length];
}
