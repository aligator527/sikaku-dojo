import { describe, expect, it } from 'vitest';

import { kanaRow } from '../kana';

describe('kanaRow', () => {
  it.each([
    ['ひょうじゅんへんさ', 'は'],
    ['ぶんさん', 'は'],
    ['がくしゅうりつ', 'か'],
    ['じゅうかいき', 'さ'],
    ['わりびき', 'わ'],
    ['ゔぁりゅー', 'あ'],
  ])('%s → %s', (reading, row) => {
    expect(kanaRow(reading)).toBe(row);
  });
});
