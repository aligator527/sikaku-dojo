import { describe as group, expect, it } from 'vitest';

import {
  binomial,
  chiSquare,
  describe,
  fisherF,
  lowerPoint,
  normal,
  normalQuantile,
  normalSf,
  parseNumberList,
  poisson,
  regress,
  studentT,
  upperPoint,
} from '../distributions';

// Reference values from scipy.stats 1.18.
const close = (actual: number, expected: number, rel = 1e-9) =>
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(rel * Math.max(1, Math.abs(expected)));

group('normal', () => {
  it('upper tail', () => {
    close(normalSf(0), 0.5);
    close(normalSf(1), 0.15865525393145707);
    close(normalSf(1.96), 0.024997895148220435);
    close(normalSf(-1.2), 0.8849303297782918);
    // relative precision in the far tail
    expect(Math.abs(normalSf(4.5) / 3.3976731247300535e-6 - 1)).toBeLessThan(1e-9);
  });

  it('quantiles', () => {
    close(normalQuantile(0.975), 1.959963984540054, 1e-12);
    close(normalQuantile(0.995), 2.5758293035489004, 1e-12);
    close(normalQuantile(0.001), -3.090232306167813, 1e-12);
    close(normalQuantile(1e-6), -4.753424308822899, 1e-10);
    close(upperPoint(normal(), 0.05), 1.6448536269514722, 1e-10);
  });

  it('non-standard parameters', () => {
    close(normal(50, 10).cdf(60), 1 - 0.15865525393145707);
  });
});

group('t', () => {
  it('upper points', () => {
    close(upperPoint(studentT(1), 0.05), 6.313751514675044, 1e-10);
    close(upperPoint(studentT(5), 0.025), 2.5705818356363155, 1e-10);
    close(upperPoint(studentT(10), 0.025), 2.2281388519862753, 1e-10);
    close(upperPoint(studentT(30), 0.005), 2.749995653567226, 1e-10);
    close(upperPoint(studentT(120), 0.05), 1.6576508993552357, 1e-10);
    close(upperPoint(studentT(2.5), 0.1), 1.7302509288071761, 1e-10);
  });

  it('tail probabilities and density', () => {
    close(studentT(3).sf(2), 0.06966298427942152);
    close(studentT(10).sf(-1.5), 0.9177463367772799);
    close(studentT(25).sf(3.2), 0.001857984216965062);
    close(studentT(4).pdf(1), 0.21466252583997986);
  });
});

group('chi-square', () => {
  it('upper points, including the far lower tail', () => {
    close(upperPoint(chiSquare(1), 0.05), 3.8414588206941285, 1e-10);
    close(upperPoint(chiSquare(10), 0.05), 18.30703805327515, 1e-10);
    close(upperPoint(chiSquare(30), 0.01), 50.892181311517085, 1e-10);
    close(upperPoint(chiSquare(100), 0.975), 74.22192747492373, 1e-10);
    expect(Math.abs(upperPoint(chiSquare(1), 0.995) / 3.927042222051594e-5 - 1)).toBeLessThan(1e-8);
  });

  it('tail probabilities and density', () => {
    close(chiSquare(4).sf(9.49), 0.049953131223294894);
    close(chiSquare(1).sf(0.0001), 0.9920212873707368);
    close(chiSquare(50).sf(80), 0.00448265656557319);
    close(chiSquare(3).pdf(2), 0.2075537487102974);
  });
});

group('F', () => {
  it('upper points', () => {
    close(upperPoint(fisherF(1, 1), 0.05), 161.4476387975882, 1e-10);
    close(upperPoint(fisherF(5, 10), 0.05), 3.3258345304130104, 1e-10);
    close(upperPoint(fisherF(3, 20), 0.025), 3.858698666273213, 1e-10);
    close(upperPoint(fisherF(10, 120), 0.01), 2.4720767547849394, 1e-10);
    close(upperPoint(fisherF(2, 7), 0.05), 4.737414127775881, 1e-10);
  });

  it('density', () => {
    close(fisherF(3, 9).pdf(1.2), 0.3259361861581783);
  });
});

group('discrete', () => {
  it('binomial cdf', () => {
    close(binomial(10, 0.3).cdf(3), 0.6496107184000002);
    close(binomial(20, 0.5).cdf(10), 0.5880985260009766);
    close(binomial(100, 0.02).cdf(0), 0.1326195558947532);
    close(binomial(50, 0.9).cdf(44), 0.3838769922757227);
    close(binomial(10, 0.3).sf(3) + binomial(10, 0.3).cdf(3), 1);
    close(binomial(10, 0.3).pdf(3), 0.266827932);
    expect(binomial(10, 0.3).pdf(2.5)).toBe(0);
  });

  it('poisson cdf', () => {
    close(poisson(2).cdf(3), 0.857123460498547);
    close(poisson(0.5).cdf(0), 0.6065306597126334);
    close(poisson(10).cdf(15), 0.9512595966960213);
  });

  it('discrete upper point is the smallest k with P(X > k) ≤ α', () => {
    const d = binomial(20, 0.5);
    const k = upperPoint(d, 0.05);
    expect(d.sf(k)).toBeLessThanOrEqual(0.05);
    expect(d.sf(k - 1)).toBeGreaterThan(0.05);
    expect(lowerPoint(normal(), 0.5)).toBeCloseTo(0, 10);
  });
});

group('descriptive statistics', () => {
  it('summarises a sample with both variance conventions', () => {
    const d = describe([48, 50, 51, 49, 52])!;
    expect(d.mean).toBe(50);
    expect(d.variance).toBe(2);
    expect(d.unbiasedVariance).toBe(2.5);
    expect(d.median).toBe(50);
    expect(d.q1).toBe(48.5);
    expect(d.q3).toBe(51.5);
  });

  it('quartiles for an even count use the halves', () => {
    const d = describe([1, 2, 3, 4, 5, 6, 7, 8])!;
    expect([d.q1, d.median, d.q3]).toEqual([2.5, 4.5, 6.5]);
  });

  it('regression', () => {
    const r = regress([1, 2, 3, 4, 5], [2, 4, 5, 4, 5])!;
    close(r.slope, 0.6);
    close(r.intercept, 2.2);
    close(r.correlation, 0.7745966692414834);
  });

  it('parses messy number lists', () => {
    expect(parseNumberList('１２，3.5、 -1\n4 x')).toEqual([12, 3.5, -1, 4]);
  });
});
