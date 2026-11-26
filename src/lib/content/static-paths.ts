import { getExams, type Exam } from './exams';

/** getStaticPaths helper for every page under /exams/<exam>/. */
export async function examPaths(): Promise<{ params: { exam: string }; props: { exam: Exam } }[]> {
  return (await getExams()).map((exam) => ({ params: { exam: exam.id }, props: { exam } }));
}
