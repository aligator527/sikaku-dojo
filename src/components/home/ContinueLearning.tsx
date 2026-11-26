import { currentStreak, daysBetween, dueReviews, summarize, toDateKey } from '../../domain/progress';
import { t } from '../../i18n';
import { useProgress } from '../hooks/useProgress';
import { useIndexes } from '../hooks/useQuestionData';
import { reviewHref } from '../me/ReviewQueue';
import s from './Home.module.css';

export interface ExamRef {
  id: string;
  name: string;
  href: string;
  drillHref: string;
}

/**
 * Exams the learner has started, most recently practised first, with today's reviews.
 * Renders nothing (and fetches nothing) for new visitors.
 */
export default function ContinueLearning({ exams }: { exams: ExamRef[] }) {
  const { progress, ready } = useProgress();
  const touched = new Set(Object.keys(progress.attempts).map((id) => id.slice(0, id.indexOf('/'))));
  const startedIds = exams
    .filter((e) => touched.has(e.id) || progress.goals[e.id]?.examDate)
    .map((e) => e.id);
  const indexes = useIndexes(ready ? startedIds : []);

  if (!ready || startedIds.length === 0 || indexes.status !== 'ready') return null;
  const today = toDateKey(new Date());

  const started = exams
    .filter((e) => startedIds.includes(e.id))
    .map((exam) => {
      const ids = (indexes.value[exam.id] ?? []).map((q) => q.id);
      const last = ids.reduce((latest, id) => {
        const at = progress.attempts[id]?.lastAt ?? '';
        return at > latest ? at : latest;
      }, '');
      return { exam, last, sum: summarize(progress, ids), due: dueReviews(progress, ids, today).length };
    })
    .sort((a, b) => b.last.localeCompare(a.last));
  const totalDue = started.reduce((n, x) => n + x.due, 0);
  const streak = currentStreak(progress, today);

  return (
    <section className={s.continue}>
      <div className={s.continueHead}>
        <h2 className="section-title">{t.me.continue}</h2>
        {streak > 0 && (
          <p className={s.streak}>
            {t.me.calendar.streak} <span className="num">{streak}</span>
            {t.me.calendar.days}
          </p>
        )}
      </div>
      {totalDue > 0 && (
        <p className={s.reviewNote}>
          {t.me.review.title} <span className="num">{t.me.review.count(totalDue)}</span>
        </p>
      )}
      <ul className={s.continueList}>
        {started.map(({ exam, sum, due }) => {
          const date = progress.goals[exam.id]?.examDate;
          return (
            <li className={s.continueRow} key={exam.id}>
              <a href={exam.href}>{exam.name}</a>
              <span aria-label={`${sum.answered}/${sum.total}問解答`}>
                <span className={s.track}>
                  <span
                    className={s.fill}
                    style={{ width: `${sum.total ? (sum.answered / sum.total) * 100 : 0}%` }}
                  />
                </span>
                <span className="meta num">
                  {sum.answered}/{sum.total}
                  {sum.accuracy !== null && `・${Math.round(sum.accuracy * 100)}%`}
                </span>
              </span>
              <span className={s.countdown}>
                {due > 0 ? (
                  <a href={reviewHref(exam.drillHref)}>
                    {t.me.review.start} {t.me.review.count(due)}
                  </a>
                ) : date ? (
                  t.exam.daysLeft(daysBetween(today, date))
                ) : (
                  ''
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
