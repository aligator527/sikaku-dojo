import { getCollection, type CollectionEntry } from 'astro:content';

export type GuideEntry = CollectionEntry<'guides'>;

export async function getGuide(examId: string): Promise<GuideEntry | undefined> {
  return (await getCollection('guides', (g) => g.data.exam.id === examId))[0];
}
