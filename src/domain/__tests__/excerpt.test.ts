import { describe, expect, it } from 'vitest';

import { excerpt } from '../../lib/markdown/excerpt';

describe('excerpt', () => {
  it('replaces math and strips markdown', () => {
    expect(excerpt('**平均** $\\bar{x}$ を求めよ。\n\n$$a+b$$')).toBe('平均 〔式〕 を求めよ。 〔式〕');
  });

  it('truncates by characters, not bytes', () => {
    expect(excerpt('あ'.repeat(100), 10)).toBe(`${'あ'.repeat(10)}…`);
  });
});
