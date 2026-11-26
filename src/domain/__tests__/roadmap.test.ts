import { describe, expect, it } from 'vitest';

import { DEFAULT_GEOMETRY as g, edgePath, layoutRoadmap } from '../roadmap';

describe('roadmap layout', () => {
  const exams = [
    { id: 'a2', category: 'stat', tier: 2, order: 1 },
    { id: 'a3x', category: 'stat', tier: 3, order: 2 },
    { id: 'a3y', category: 'stat', tier: 3, order: 3 },
    { id: 'b1', category: 'acc', tier: 1, order: 1 },
  ];
  const layout = layoutRoadmap(exams, ['stat', 'none', 'acc'], [1, 2, 3, 4]);

  it('gives a category as many columns as its busiest tier and centres lone exams', () => {
    expect(layout.groups.map((x) => x.category)).toEqual(['stat', 'acc']);
    expect(layout.nodes.get('a3x')!.column).toBe(0);
    expect(layout.nodes.get('a3y')!.column).toBe(1);
    expect(layout.nodes.get('a2')!.column).toBe(0.5);
    expect(layout.nodes.get('b1')!.column).toBe(2);
  });

  it('places tiers top to bottom', () => {
    expect(layout.nodes.get('b1')!.y).toBe(g.top);
    expect(layout.nodes.get('a3x')!.y).toBe(g.top + 2 * (g.nodeHeight + g.rowGap));
  });

  it('draws downward edges from the bottom edge to the top edge', () => {
    const d = edgePath(layout.nodes.get('a2')!, layout.nodes.get('a3x')!);
    expect(d.startsWith('M')).toBe(true);
    expect(d).toContain(`${layout.nodes.get('a3x')!.y.toFixed(1)}`);
  });
});
