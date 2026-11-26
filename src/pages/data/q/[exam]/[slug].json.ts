/**
 * One pre-rendered question: /data/q/<exam>/<slug>.json
 * Drills fetch these one at a time (prefetching the next), mocks fetch their selection in parallel.
 */
import type { APIRoute, GetStaticPaths, InferGetStaticPropsType } from 'astro';

import { getExams, getQuestions } from '../../../../lib/content';

export const getStaticPaths = (async () => {
  const exams = await getExams();
  const perExam = await Promise.all(
    exams.map(async (exam) =>
      (await getQuestions(exam.id)).map((question) => ({
        params: { exam: exam.id, slug: question.slug },
        props: { question },
      })),
    ),
  );
  return perExam.flat();
}) satisfies GetStaticPaths;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export const GET: APIRoute<Props> = ({ props }) =>
  new Response(JSON.stringify(props.question), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
