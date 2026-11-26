import type { ChoiceStyle } from '../config/catalog';
import type { Difficulty, SourceKind } from './question';

const KATAKANA = ['ア', 'イ', 'ウ', 'エ', 'オ', 'カ', 'キ', 'ク', 'ケ', 'コ'];
const CIRCLED = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩'];

/** Label for the n-th choice (1-based), as printed on that exam's paper. */
export function choiceLabel(style: ChoiceStyle, n: number): string {
  switch (style) {
    case 'katakana':
      return KATAKANA[n - 1] ?? String(n);
    case 'circled':
      return CIRCLED[n - 1] ?? String(n);
    case 'alpha':
      return String.fromCharCode(64 + n);
    case 'number':
      return String(n);
  }
}

export const DIFFICULTY_LABEL: Record<Difficulty, string> = { 1: '基礎', 2: '標準', 3: '発展' };

export const SOURCE_KIND_LABEL: Record<SourceKind, string> = {
  past: '過去問',
  adapted: '改題',
  original: 'オリジナル',
};

export const FORMAT_LABEL = {
  single: '選択',
  multiple: '複数選択',
  numeric: '数値入力',
  journal: '仕訳',
  essay: '記述',
} as const;
