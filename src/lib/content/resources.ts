import { getCollection, type CollectionEntry } from 'astro:content';

type Item = CollectionEntry<'resources'>['data']['items'][number];

export type Resource = Omit<Item, 'exams'> & { exams: string[]; group: string };

export const RESOURCE_KIND_LABEL: Record<Resource['kind'], string> = {
  official: '公式',
  pastExam: '過去問・サンプル',
  textbook: '書籍',
  course: '講座',
  article: '解説記事',
  video: '動画',
  tool: 'ツール',
  community: 'コミュニティ',
};

export const RESOURCE_COST_LABEL: Record<Resource['cost'], string> = {
  free: '無料',
  partial: '一部無料',
  paid: '有料',
};

const KIND_ORDER = Object.keys(RESOURCE_KIND_LABEL) as Resource['kind'][];

export async function getResources(examId?: string): Promise<Resource[]> {
  const groups = await getCollection('resources');
  return groups
    .flatMap((g) =>
      g.data.items.map((item) => ({ ...item, exams: item.exams.map((e) => e.id), group: g.data.title })),
    )
    .filter((r) => !examId || r.exams.includes(examId))
    .sort(
      (a, b) =>
        KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind) ||
        (a.lang === b.lang ? 0 : a.lang === 'ja' ? -1 : 1),
    );
}
