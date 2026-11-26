/** 今日の復習: questions whose spaced review is due, per exam, with a one-click review drill. */
import { RotateCcw } from 'lucide-react';

import { dueReviews, upcomingReviews, type ProgressState } from '../../domain/progress';
import { t } from '../../i18n';
import s from './Me.module.css';

export interface ReviewExam {
  id: string;
  name: string;
  drillHref: string;
  questionIds: string[];
}

export const reviewHref = (drillHref: string) => `${drillHref}?scope=review&start=1`;

export function ReviewQueue({
  exams,
  progress,
  today,
  showUpcoming = true,
}: {
  exams: ReviewExam[];
  progress: ProgressState;
  today: string;
  showUpcoming?: boolean;
}) {
  const c = t.me.review;
  const rows = exams
    .map((e) => ({ exam: e, due: dueReviews(progress, e.questionIds, today).length }))
    .filter((r) => r.due > 0);
  const upcoming = upcomingReviews(
    progress,
    exams.flatMap((e) => e.questionIds),
    today,
    7,
  );
  const total = rows.reduce((n, r) => n + r.due, 0);
  const peak = Math.max(1, ...upcoming);

  return (
    <div className={s.review}>
      {total === 0 ? (
        <p className="meta">{c.none}</p>
      ) : (
        <ul className={s.reviewList}>
          {rows.map(({ exam, due }) => (
            <li key={exam.id}>
              <span>{exam.name}</span>
              <span className="num">{c.count(due)}</span>
              <a className="btn btn--sm" href={reviewHref(exam.drillHref)}>
                <RotateCcw size={14} aria-hidden="true" /> {c.start}
              </a>
            </li>
          ))}
        </ul>
      )}
      {showUpcoming && upcoming.some((n) => n > 0) && (
        <div className={s.upcoming}>
          <p className={s.upcomingTitle}>{c.upcoming}</p>
          <ol className={s.upcomingBars}>
            {upcoming.map((n, i) => (
              <li key={i} title={c.upcomingDay(i + 1, n)}>
                <span className={s.upcomingBar} style={{ height: `${(n / peak) * 100}%` }} />
                <span className={`${s.upcomingNum} num`}>{n || ''}</span>
                <span className={s.upcomingLabel}>{i === 0 ? c.tomorrow : `+${i + 1}`}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
      <p className={s.note}>{c.how}</p>
    </div>
  );
}
