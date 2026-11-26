import { useEffect, useState } from 'react';

import { toDateKey } from '../../domain/progress';
import { pickDaily } from '../../domain/sampling';
import { t } from '../../i18n';
import { routes } from '../../lib/paths';
import { useIndexes } from '../hooks/useQuestionData';
import s from './Home.module.css';

export interface DailyExam {
  id: string;
  shortName: string;
  topics: Record<string, string>;
}

/** 今日の一問 — the same question for every visitor on a given day, drawn from every exam. */
export default function DailyQuestion({ exams }: { exams: DailyExam[] }) {
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => setToday(toDateKey(new Date())), []);
  const indexes = useIndexes(today ? exams.map((e) => e.id) : []);

  const candidates =
    indexes.status === 'ready'
      ? exams.flatMap((exam) =>
          (indexes.value[exam.id] ?? []).filter((q) => q.format !== 'essay').map((q) => ({ exam, q })),
        )
      : [];
  const item = today ? pickDaily(candidates, today) : undefined;
  const [, m, d] = (today ?? '--').split('-');

  return (
    <aside className={s.daily} aria-label={t.home.daily}>
      <p className={s.dailyHead}>
        <span className={s.dailyLabel}>{t.home.daily}</span>
        {today && (
          <span className="num">
            {Number(m)}月{Number(d)}日
          </span>
        )}
      </p>
      {item ? (
        <>
          <p className={s.dailyExam}>
            {item.exam.shortName} {t.question.number(item.q.order)}
          </p>
          <p className={s.dailyTopic}>{item.q.topics.map((id) => item.exam.topics[id] ?? id).join('・')}</p>
          <p className={s.dailyAction}>
            <a className="btn" href={routes.question(item.exam.id, item.q.slug)}>
              {t.home.dailySolve}
            </a>
          </p>
        </>
      ) : (
        <p className="meta">{indexes.status === 'error' ? t.drill.loadError : t.common.loading}</p>
      )}
    </aside>
  );
}
