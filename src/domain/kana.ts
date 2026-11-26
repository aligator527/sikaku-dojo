/** 50音 (gojūon) helpers for the glossary index. */

export const KANA_ROWS = ['あ', 'か', 'さ', 'た', 'な', 'は', 'ま', 'や', 'ら', 'わ'] as const;
export type KanaRow = (typeof KANA_ROWS)[number];

const ROW_MEMBERS: Record<KanaRow, string> = {
  あ: 'あいうえおぁぃぅぇぉゔ',
  か: 'かきくけこがぎぐげごゕゖ',
  さ: 'さしすせそざじずぜぞ',
  た: 'たちつてとだぢづでどっ',
  な: 'なにぬねの',
  は: 'はひふへほばびぶべぼぱぴぷぺぽ',
  ま: 'まみむめも',
  や: 'やゆよゃゅょ',
  ら: 'らりるれろ',
  わ: 'わをんゎゐゑ',
};

/** Which 行 a hiragana reading belongs to, by its first character. */
export function kanaRow(reading: string): KanaRow {
  const first = reading.trim().charAt(0);
  for (const row of KANA_ROWS) {
    if (ROW_MEMBERS[row].includes(first)) return row;
  }
  return 'わ';
}

/** Japanese dictionary order for readings. */
export const compareReading = (a: string, b: string) => a.localeCompare(b, 'ja');
