import { daysBetween, summarize, toDateKey } from '../../domain/progress';
import { t } from '../../i18n';
import { progress as actions } from '../../stores/progress';
import { useProgress } from '../hooks/useProgress';
import s from './Exam.module.css';

interface Props {
  examId: string;
  questionIds: string[];
}

const pct = (v: number | null) => (v === null ? '—' : `${Math.round(v * 100)}`);

/** Personal summary for one exam plus the 受験予定日 countdown. */
export default function ExamProgressPanel({ examId, questionIds }: Props) {
  const { progress, ready } = useProgress();
  const sum = summarize(progress, questionIds);
  const examDate = progress.goals[examId]?.examDate;
  const today = toDateKey(new Date());

  return (
    <section className={s.panel} aria-label={t.me.title}>
      <h2 className={s.panelTitle}>{t.me.title}</h2>
      <dl className={s.stats}>
        <div className={s.stat}>
          <dt>{t.me.answered}</dt>
          <dd>
            {ready ? sum.answered : '—'}
            <small>/ {sum.total}</small>
          </dd>
        </div>
        <div className={s.stat}>
          <dt>{t.me.accuracy}</dt>
          <dd>
            {ready ? pct(sum.accuracy) : '—'}
            <small>%</small>
          </dd>
        </div>
        <div className={s.stat}>
          <dt title={t.me.masteredHelp}>{t.me.mastered}</dt>
          <dd>{ready ? sum.mastered : '—'}</dd>
        </div>
      </dl>
      <div className={s.goal}>
        <label htmlFor={`goal-${examId}`}>{t.exam.goal}</label>
        <input
          id={`goal-${examId}`}
          type="date"
          className="input"
          value={examDate ?? ''}
          min={today}
          onChange={(e) => actions.setExamDate(examId, e.target.value || undefined)}
        />
        {ready && examDate && (
          <span className={s.countdown}>{t.exam.daysLeft(daysBetween(today, examDate))}</span>
        )}
      </div>
    </section>
  );
}
