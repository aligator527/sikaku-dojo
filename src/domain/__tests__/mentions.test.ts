import { describe, expect, it } from 'vitest';

import { compileNeedles } from '../mentions';

const matcher = compileNeedles([
  { id: 'variance', names: ['分散'] },
  { id: 'anova', names: ['分散分析', '一元配置分散分析'] },
  { id: 'roi', names: ['ROI', '投資利益率'] },
  { id: 'adam', names: ['Adam'] },
  { id: 'x', names: ['X'] },
  { id: 't', names: ['t分布'] },
  { id: 'swot', names: ['SWOT分析'] },
  { id: 'dx', names: ['DX'] },
  { id: 'bpr', names: ['BPR（ビジネスプロセス・リエンジニアリング）'] },
  { id: 'chi', names: ['χ²検定'] },
  { id: 'kappa', names: ['κ係数'] },
  { id: 'sensitivity', names: ['感度'] },
  { id: 'sensitivity-analysis', names: ['感度分析'] },
]);

const ids = (parts: (string | undefined)[]) => matcher.find(parts).map((m) => m.id);

describe('compileNeedles', () => {
  it('lets the longer name win', () => {
    expect(ids(['一元配置分散分析の表を作る'])).toEqual(['anova']);
    expect(ids(['分散分析の前に分散を求める'])).toEqual(['anova', 'variance']);
  });

  it('matches latin names as whole words with the same case, ignoring width', () => {
    expect(ids(['ROIを計算する'])).toEqual(['roi']);
    expect(ids(['ＲＯＩで評価する'])).toEqual(['roi']);
    expect(ids(['roi や PROIBIT や ROIC は別物'])).toEqual([]);
    expect(ids(['AdamW ではなく Adam を使う'])).toEqual(['adam']);
    expect(ids(['$\\int f(x)\\,dx$ と DX 推進'])).toEqual(['dx']);
    expect(ids(['CDFt分布'])).toEqual([]);
  });

  it('ignores spaces and short inline math between Latin and Japanese', () => {
    expect(ids(['自由度 9 の $t$ 分布に従う'])).toEqual(['t']);
    expect(ids(['SWOT 分析を行う'])).toEqual(['swot']);
  });

  it('reads one-symbol inline math, Greek letters included', () => {
    expect(ids(['$\\chi^2$ 検定と $\\kappa$ 係数'])).toEqual(['chi', 'kappa']);
    expect(ids(['$\\chi^{2}$ 検定'])).toEqual(['chi']);
    expect(ids(['$\\frac{a}{b}$ 検定'])).toEqual([]);
  });

  it('lets names that are not reported still hide shorter ones', () => {
    const notAnalysis = (id: string) => id !== 'sensitivity-analysis';
    expect(matcher.find(['感度分析を行う'], notAnalysis)).toEqual([]);
    expect(matcher.find(['検査の感度と感度分析'], notAnalysis).map((m) => m.id)).toEqual(['sensitivity']);
  });

  it('matches both parts of a name written as A（B）', () => {
    expect(ids(['BPR を進める'])).toEqual(['bpr']);
    expect(ids(['ビジネスプロセス・リエンジニアリングとは'])).toEqual(['bpr']);
  });

  it('ignores one-character names', () => {
    expect(ids(['X 社の事例'])).toEqual([]);
  });

  it('orders mentions by part, then by position', () => {
    const found = matcher.find(['投資利益率を求めよ', undefined, '分散と Adam']);
    expect(found).toEqual([
      { id: 'roi', part: 0, pos: 0 },
      { id: 'variance', part: 2, pos: 0 },
      { id: 'adam', part: 2, pos: 3 },
    ]);
  });

  it('keeps the earliest part when a term appears in several', () => {
    expect(matcher.find(['解説の分散', '問題文の分散'])[0]).toEqual({ id: 'variance', part: 0, pos: 3 });
  });
});
