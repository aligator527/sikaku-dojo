/**
 * Layout of the qualification roadmap: one column group per field (category),
 * one row per tier (入門 → 上級), and edges for suggested next steps and overlaps.
 * Pure geometry, so the page can draw it as static SVG.
 */

export interface RoadmapExam {
  id: string;
  category: string;
  tier: number;
  order: number;
}

export interface RoadmapEdge {
  from: string;
  to: string;
  kind: 'next' | 'related';
}

export interface PlacedNode {
  id: string;
  x: number;
  y: number;
  column: number;
}

export interface Geometry {
  nodeWidth: number;
  nodeHeight: number;
  columnGap: number;
  rowGap: number;
  /** Space above the first row for column headings. */
  top: number;
  /** Space left of the first column for tier labels. */
  left: number;
}

export const DEFAULT_GEOMETRY: Geometry = {
  nodeWidth: 152,
  nodeHeight: 58,
  columnGap: 36,
  rowGap: 46,
  top: 44,
  left: 56,
};

export interface Layout {
  nodes: Map<string, PlacedNode>;
  /** Category headings centred over their columns. */
  groups: { category: string; x: number; width: number }[];
  rows: { tier: number; y: number }[];
  width: number;
  height: number;
}

export function layoutRoadmap(
  exams: readonly RoadmapExam[],
  categories: readonly string[],
  tiers: readonly number[],
  g: Geometry = DEFAULT_GEOMETRY,
): Layout {
  const nodes = new Map<string, PlacedNode>();
  const groups: Layout['groups'] = [];
  const stepX = g.nodeWidth + g.columnGap;
  const stepY = g.nodeHeight + g.rowGap;
  let column = 0;

  for (const category of categories) {
    const members = exams.filter((e) => e.category === category);
    if (members.length === 0) continue;
    // A category needs as many columns as it has exams on its busiest tier.
    const perTier = new Map<number, RoadmapExam[]>();
    for (const e of [...members].sort((a, b) => a.order - b.order))
      perTier.set(e.tier, [...(perTier.get(e.tier) ?? []), e]);
    const span = Math.max(...[...perTier.values()].map((list) => list.length));
    for (const [tier, list] of perTier) {
      const row = tiers.indexOf(tier);
      // Centre a lone exam inside a wide group.
      const offset = (span - list.length) / 2;
      list.forEach((e, i) =>
        nodes.set(e.id, {
          id: e.id,
          column: column + offset + i,
          x: g.left + (column + offset + i) * stepX,
          y: g.top + row * stepY,
        }),
      );
    }
    groups.push({ category, x: g.left + column * stepX, width: span * stepX - g.columnGap });
    column += span;
  }

  return {
    nodes,
    groups,
    rows: tiers.map((tier, i) => ({ tier, y: g.top + i * stepY })),
    width: g.left + column * stepX - g.columnGap + 8,
    height: g.top + tiers.length * stepY - g.rowGap + 8,
  };
}

/**
 * SVG path for an edge. Steps down the tiers are drawn bottom → top as an S-curve;
 * edges within a row (or upward) leave from the side.
 */
export function edgePath(a: PlacedNode, b: PlacedNode, g: Geometry = DEFAULT_GEOMETRY): string {
  const f = (n: number) => n.toFixed(1);
  if (b.y > a.y) {
    const x1 = a.x + g.nodeWidth / 2;
    const y1 = a.y + g.nodeHeight;
    const x2 = b.x + g.nodeWidth / 2;
    const y2 = b.y;
    const my = (y1 + y2) / 2;
    return `M${f(x1)},${f(y1)} C${f(x1)},${f(my)} ${f(x2)},${f(my)} ${f(x2)},${f(y2)}`;
  }
  // Same row but not neighbours: arc underneath, so the line does not run behind the boxes between.
  if (b.y === a.y && Math.abs(b.column - a.column) > 1) {
    const x1 = a.x + g.nodeWidth / 2;
    const x2 = b.x + g.nodeWidth / 2;
    const y = a.y + g.nodeHeight;
    const dip = g.rowGap * 0.75;
    return `M${f(x1)},${f(y)} C${f(x1)},${f(y + dip)} ${f(x2)},${f(y + dip)} ${f(x2)},${f(y)}`;
  }
  const rightward = b.x >= a.x;
  const x1 = rightward ? a.x + g.nodeWidth : a.x;
  const x2 = rightward ? b.x : b.x + g.nodeWidth;
  const y1 = a.y + g.nodeHeight / 2;
  const y2 = b.y + g.nodeHeight / 2;
  const mx = (x1 + x2) / 2;
  return `M${f(x1)},${f(y1)} C${f(mx)},${f(y1)} ${f(mx)},${f(y2)} ${f(x2)},${f(y2)}`;
}
