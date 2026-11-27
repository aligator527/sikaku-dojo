/**
 * Finds which glossary terms a piece of text mentions.
 *
 * Longer names win: once "分散分析" is matched, the "分散" inside it no longer counts, so a
 * question about ANOVA is not tagged with "分散" unless "分散" also appears on its own.
 * Latin names (ROI, AUC, Adam) only match as whole words and with the same case, so "DX" does
 * not match the "dx" of an integral. Spaces and inline-math dollars between Latin letters and
 * Japanese are ignored on both sides: "$t$ 分布" and "SWOT 分析" match "t分布" and "SWOT分析".
 * A name such as "BPR（ビジネスプロセス・リエンジニアリング）" also matches either part alone.
 */

export interface Needle {
  id: string;
  /** Term name and aliases. Names shorter than two characters are ignored. */
  names: string[];
}

export interface Mention {
  id: string;
  /** Index of the part (in the order given) where the term first appears. */
  part: number;
  /** Offset of the first appearance inside that part. */
  pos: number;
}

const CJK = '\\u3005\\u3040-\\u30ff\\u3400-\\u9fff';
/** Inline math that is just a symbol: $t$, $R^2$, $\chi^2$, $\kappa$. */
const SHORT_MATH = /\$\s*(\\[A-Za-z]+|[A-Za-z0-9]{1,3})\s*(?:\^\{?([0-9])\}?)?\s*\$/g;
const GREEK: Record<string, string> = {
  alpha: 'α',
  beta: 'β',
  gamma: 'γ',
  Gamma: 'Γ',
  delta: 'δ',
  epsilon: 'ε',
  eta: 'η',
  theta: 'θ',
  kappa: 'κ',
  lambda: 'λ',
  mu: 'μ',
  pi: 'π',
  rho: 'ρ',
  sigma: 'σ',
  tau: 'τ',
  phi: 'φ',
  chi: 'χ',
  psi: 'ψ',
  omega: 'ω',
};
const LATIN_THEN_CJK = new RegExp(`([A-Za-z0-9\\u0370-\\u03ff])\\s+(?=[${CJK}])`, 'g');
const CJK_THEN_LATIN = new RegExp(`([${CJK}])\\s+(?=[A-Za-z0-9\\u0370-\\u03ff])`, 'g');

function plainSymbol(math: string, symbol: string, power: string | undefined): string {
  const base = symbol.startsWith('\\') ? GREEK[symbol.slice(1)] : symbol;
  return base === undefined ? math : base + (power ?? '');
}

export const normalizeForMatch = (s: string) =>
  s
    .normalize('NFKC')
    .replace(SHORT_MATH, plainSymbol)
    .replace(LATIN_THEN_CJK, '$1')
    .replace(CJK_THEN_LATIN, '$1');

const WORD = /[A-Za-z0-9]/;
const PARENTHESIZED = /^(.+?)\((.+)\)$/;

/** The name itself plus, for "A（B）", A and B on their own. */
function variants(raw: string): string[] {
  const name = normalizeForMatch(raw.trim());
  const m = PARENTHESIZED.exec(name);
  return m ? [name, m[1]!.trim(), m[2]!.trim()] : [name];
}

interface Compiled {
  id: string;
  name: string;
  /** Whether the name starts / ends with a Latin letter or digit (then it needs a word boundary). */
  left: boolean;
  right: boolean;
}

export interface Matcher {
  /**
   * Mentions ordered by where they first appear (earlier parts first). Every name takes part in
   * longest-match, but only terms passing `accept` are reported: "感度分析" can then hide the
   * "感度" inside it even where 感度分析 itself is not a term of interest.
   */
  find(parts: (string | undefined)[], accept?: (id: string) => boolean): Mention[];
}

export function compileNeedles(needles: Needle[]): Matcher {
  const seen = new Set<string>();
  const compiled: Compiled[] = [];
  for (const needle of needles)
    for (const name of needle.names.flatMap(variants)) {
      if (name.length < 2 || seen.has(`${needle.id}\u0000${name}`)) continue;
      seen.add(`${needle.id}\u0000${name}`);
      compiled.push({ id: needle.id, name, left: WORD.test(name[0]!), right: WORD.test(name.at(-1)!) });
    }
  compiled.sort((a, b) => b.name.length - a.name.length);

  return {
    find(parts, accept = () => true) {
      const first = new Map<string, Mention>();
      parts.forEach((raw, part) => {
        if (!raw) return;
        const text = normalizeForMatch(raw);
        const taken = new Uint8Array(text.length);
        for (const { id, name, left, right } of compiled) {
          for (let at = text.indexOf(name); at !== -1; at = text.indexOf(name, at + 1)) {
            const end = at + name.length;
            if ((left && WORD.test(text[at - 1] ?? '')) || (right && WORD.test(text[end] ?? ''))) continue;
            if (taken.subarray(at, end).some(Boolean)) continue;
            taken.fill(1, at, end);
            if (!accept(id)) continue;
            const prev = first.get(id);
            if (!prev || part < prev.part || (part === prev.part && at < prev.pos))
              first.set(id, { id, part, pos: at });
          }
        }
      });
      return [...first.values()].sort((a, b) => a.part - b.part || a.pos - b.pos);
    },
  };
}
