import { getCollection } from 'astro:content';

import type { BlueprintRow } from '../../domain/sampling';

export interface MockDefinition {
  id: string;
  /** URL segment: the file name without the "<exam>-" prefix. */
  slug: string;
  exam: string;
  title: string;
  description: string;
  durationMin: number;
  passingRate: number;
  questions?: string[];
  blueprint?: BlueprintRow[];
}

/** Reserved slug for the learner-configured mock. */
export const CUSTOM_MOCK_SLUG = 'custom';

export async function getMocks(examId: string): Promise<MockDefinition[]> {
  const entries = await getCollection('mocks', (m) => m.data.exam.id === examId);
  return entries
    .sort((a, b) => a.data.order - b.data.order)
    .map((m) => ({
      id: m.id,
      slug: m.id.startsWith(`${examId}-`) ? m.id.slice(examId.length + 1) : m.id,
      exam: examId,
      title: m.data.title,
      description: m.data.description,
      durationMin: m.data.durationMin,
      passingRate: m.data.passingRate,
      questions: m.data.questions?.map((q) => q.id),
      blueprint: m.data.blueprint,
    }));
}
