import { Download, Trash2, Upload } from 'lucide-react';
import { useRef, useState } from 'react';

import { daysBetween, summarize, summarizeByTopic, toDateKey, weakestTopics } from '../../domain/progress';
import { t } from '../../i18n';
import { progress as actions } from '../../stores/progress';
import { isSupported } from '../../lib/offline';
import { routes } from '../../lib/paths';
import { StatusMark } from '../exam/QuestionIndex';
import { useProgress } from '../hooks/useProgress';
import { useIndexes } from '../hooks/useQuestionData';
import OfflineButton from '../offline/OfflineButton';
import s from './Me.module.css';
import { ReviewQueue } from './ReviewQueue';
import { StudyCalendar } from './StudyCalendar';

export interface MeExam {
  id: string;
  name: string;
  shortName: string;
  href: string;
  drillHref: string;
  topics: Record<string, string>;
}

interface QuestionRef {
  exam: string;
  label: string;
  href: string;
}

interface Props {
  exams: MeExam[];
}

const pct = (v: number | null) => (v === null ? '—' : `${Math.round(v * 100)}%`);
const date = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : `${d.getMonth() + 1}/${d.getDate()}`;
};

/** 学習記録: everything the learner has done, plus export / import / reset. */
export default function MeDashboard({ exams: examList }: Props) {
  const { progress, ready } = useProgress();
  const [mode, setMode] = useState<'merge' | 'replace'>('merge');
  const [message, setMessage] = useState('');
  const file = useRef<HTMLInputElement>(null);
  const today = toDateKey(new Date());
  const indexes = useIndexes(examList.map((e) => e.id));
  const offlineReady = isSupported() && import.meta.env.PROD;

  if (!ready || indexes.status === 'loading') return <p className="meta">{t.common.loading}</p>;
  if (indexes.status === 'error') return <p className="meta">{t.drill.loadError}</p>;

  const exams = examList.map((e) => ({ ...e, questions: indexes.value[e.id] ?? [] }));
  const questions: Record<string, QuestionRef> = {};
  for (const exam of exams)
    for (const q of exam.questions)
      questions[q.id] = {
        exam: exam.shortName,
        label: t.question.number(q.order),
        href: routes.question(exam.id, q.slug),
      };
  const reviewExams = exams.map((e) => ({
    id: e.id,
    name: e.name,
    drillHref: e.drillHref,
    questionIds: e.questions.map((q) => q.id),
  }));

  const rows = exams.map((exam) => {
    const ids = exam.questions.map((q) => q.id);
    const mocks = progress.mocks.filter((m) => m.exam === exam.id);
    const best = mocks.reduce<number | null>(
      (b, m) => Math.max(b ?? 0, m.maxScore ? m.score / m.maxScore : 0),
      null,
    );
    return { exam, sum: summarize(progress, ids), best, examDate: progress.goals[exam.id]?.examDate };
  });
  const active = rows.filter((r) => r.sum.answered > 0 || r.best !== null || r.examDate);

  const weak = exams.flatMap((exam) => {
    const byTopic = summarizeByTopic(progress, exam.questions);
    return weakestTopics(byTopic).map((topic) => ({ exam, topic, accuracy: byTopic.get(topic)!.accuracy! }));
  });

  const wrong = Object.entries(progress.attempts)
    .filter(([id, r]) => r.last !== 'correct' && questions[id])
    .sort(([, a], [, b]) => b.lastAt.localeCompare(a.lastAt))
    .slice(0, 20);

  const bookmarks = Object.entries(progress.bookmarks)
    .filter(([id]) => questions[id])
    .sort(([, a], [, b]) => b.localeCompare(a));

  const exportData = () => {
    const blob = new Blob([JSON.stringify(progress, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sikaku-dojo-progress-${today}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = async (f: File | undefined) => {
    if (!f) return;
    try {
      actions.importState(JSON.parse(await f.text()), mode);
      setMessage(t.me.importDone);
    } catch {
      setMessage(t.me.importFailed);
    } finally {
      if (file.current) file.current.value = '';
    }
  };

  return (
    <div className={s.dashboard}>
      <section>
        <h2 className="section-title">{t.me.review.title}</h2>
        <ReviewQueue exams={reviewExams} progress={progress} today={today} />
      </section>

      <section>
        <h2 className="section-title">{t.me.calendar.title}</h2>
        <StudyCalendar progress={progress} today={today} />
      </section>

      <section>
        <h2 className="section-title">{t.me.overview}</h2>
        {active.length === 0 ? (
          <p className="meta">{t.me.nothing}</p>
        ) : (
          <div className={s.scroll}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th scope="col">資格</th>
                  <th scope="col" className={s.right}>
                    {t.me.answered}
                  </th>
                  <th scope="col" className={s.right}>
                    {t.me.accuracy}
                  </th>
                  <th scope="col" className={s.right} title={t.me.masteredHelp}>
                    {t.me.mastered}
                  </th>
                  <th scope="col" className={s.right}>
                    {t.mock.best}
                  </th>
                  <th scope="col" className={s.right}>
                    {t.exam.goal}
                  </th>
                </tr>
              </thead>
              <tbody>
                {active.map(({ exam, sum, best, examDate }) => (
                  <tr key={exam.id}>
                    <td>
                      <a href={exam.href}>{exam.name}</a>
                    </td>
                    <td className={s.right}>
                      {sum.answered} / {sum.total}
                    </td>
                    <td className={s.right}>{pct(sum.accuracy)}</td>
                    <td className={s.right}>{sum.mastered}</td>
                    <td className={s.right}>{pct(best)}</td>
                    <td className={s.right}>
                      {examDate ? t.exam.daysLeft(daysBetween(today, examDate)) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 className="section-title">{t.me.weak}</h2>
        {weak.length === 0 ? (
          <p className="meta">{t.me.noWeak}</p>
        ) : (
          <ul className={s.list}>
            {weak.map(({ exam, topic, accuracy }) => (
              <li key={`${exam.id}:${topic}`}>
                <a href={`${exam.drillHref}?topic=${encodeURIComponent(topic)}`}>
                  {exam.topics[topic] ?? topic}
                </a>
                <span className="meta">{exam.shortName}</span>
                <span className="meta num">
                  {t.me.accuracy} {pct(accuracy)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className={s.columns}>
        <section>
          <h2 className="section-title">{t.me.wrong}</h2>
          {wrong.length === 0 ? (
            <p className="meta">{t.me.nothing}</p>
          ) : (
            <ul className={s.list}>
              {wrong.map(([id, r]) => (
                <li key={id}>
                  <StatusMark record={r} />
                  <a href={questions[id]!.href}>
                    {questions[id]!.exam} {questions[id]!.label}
                  </a>
                  <span className="meta num">{date(r.lastAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section>
          <h2 className="section-title">{t.me.bookmarks}</h2>
          {bookmarks.length === 0 ? (
            <p className="meta">{t.me.nothing}</p>
          ) : (
            <ul className={s.list}>
              {bookmarks.map(([id, at]) => (
                <li key={id}>
                  <StatusMark record={progress.attempts[id]} />
                  <a href={questions[id]!.href}>
                    {questions[id]!.exam} {questions[id]!.label}
                  </a>
                  <span className="meta num">{date(at)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section>
        <h2 className="section-title">{t.me.mocks}</h2>
        {progress.mocks.length === 0 ? (
          <p className="meta">{t.me.nothing}</p>
        ) : (
          <div className={s.scroll}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th scope="col">{t.mock.title}</th>
                  <th scope="col">日付</th>
                  <th scope="col" className={s.right}>
                    得点
                  </th>
                  <th scope="col" className={s.right}>
                    {t.mock.result}
                  </th>
                </tr>
              </thead>
              <tbody>
                {progress.mocks.slice(0, 15).map((m) => (
                  <tr key={m.id}>
                    <td>
                      {exams.find((e) => e.id === m.exam)?.shortName} {m.title}
                    </td>
                    <td className="num">{date(m.finishedAt)}</td>
                    <td className={s.right}>{m.maxScore ? pct(m.score / m.maxScore) : '—'}</td>
                    <td className={s.right}>
                      <span className={m.passed ? s.pass : s.fail}>
                        {m.passed ? t.mock.pass : t.mock.fail}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 className="section-title">{t.offline.title}</h2>
        <p className={s.note}>{t.offline.lead}</p>
        {offlineReady ? (
          <ul className={s.offlineList}>
            {exams.map((exam) => (
              <li key={exam.id}>
                <a href={exam.href}>{exam.name}</a>
                <OfflineButton examId={exam.id} compact />
              </li>
            ))}
          </ul>
        ) : (
          <p className="meta">{import.meta.env.DEV ? t.offline.devOnly : t.offline.unsupported}</p>
        )}
      </section>

      <section className={s.data}>
        <h2 className="section-title">{t.me.data}</h2>
        <p className={s.note}>{t.me.lead}</p>
        <div className={s.dataRow}>
          <button type="button" className="btn btn--ghost" onClick={exportData}>
            <Download size={15} aria-hidden /> {t.me.export}
          </button>
        </div>
        <div className={s.dataRow}>
          <label className={s.radio}>
            <input
              type="radio"
              name="import-mode"
              checked={mode === 'merge'}
              onChange={() => setMode('merge')}
            />
            {t.me.importMerge}
          </label>
          <label className={s.radio}>
            <input
              type="radio"
              name="import-mode"
              checked={mode === 'replace'}
              onChange={() => setMode('replace')}
            />
            {t.me.importReplace}
          </label>
          <button type="button" className="btn btn--ghost" onClick={() => file.current?.click()}>
            <Upload size={15} aria-hidden /> {t.me.import}
          </button>
          <input
            ref={file}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(e) => importData(e.target.files?.[0])}
          />
          {message && (
            <span className="meta" role="status">
              {message}
            </span>
          )}
        </div>
        <div className={s.dataRow}>
          <button
            type="button"
            className={`btn ${s.danger}`}
            onClick={() => window.confirm(t.me.resetConfirm) && actions.reset()}
          >
            <Trash2 size={15} aria-hidden /> {t.me.reset}
          </button>
        </div>
      </section>
    </div>
  );
}
