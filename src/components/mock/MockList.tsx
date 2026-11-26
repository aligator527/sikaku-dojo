import { useState } from 'react';

import { t } from '../../i18n';
import { routes } from '../../lib/paths';
import { useProgress } from '../hooks/useProgress';
import s from './Mock.module.css';

export interface MockSummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  durationMin: number;
  passingRate: number;
  questionCount: number;
}

interface Props {
  examId: string;
  mocks: MockSummary[];
  totalQuestions: number;
}

/** 模擬試験一覧 with the learner's best score, plus a form for a custom mock. */
export default function MockList({ examId, mocks, totalQuestions }: Props) {
  const { progress, ready } = useProgress();
  const [count, setCount] = useState(Math.min(20, totalQuestions));
  const [minutes, setMinutes] = useState(Math.max(10, Math.min(20, totalQuestions) * 3));

  const history = (mockId: string) => progress.mocks.filter((m) => m.exam === examId && m.mockId === mockId);

  return (
    <div>
      {mocks.length === 0 ? (
        <p className="meta">{t.mock.empty}</p>
      ) : (
        <ul className={s.list}>
          {mocks.map((m) => {
            const runs = history(m.id);
            const best = runs.reduce<(typeof runs)[number] | undefined>(
              (b, r) => (!b || r.score / r.maxScore > b.score / b.maxScore ? r : b),
              undefined,
            );
            return (
              <li className={s.item} key={m.id}>
                <div>
                  <p className={s.itemTitle}>{m.title}</p>
                  <p className={s.itemDesc}>{m.description}</p>
                  <p className={s.specs}>
                    <span>
                      {t.mock.questions} {m.questionCount}問
                    </span>
                    <span>
                      {t.mock.time} {t.mock.minutes(m.durationMin)}
                    </span>
                    <span>
                      {t.mock.passLine} {Math.round(m.passingRate * 100)}%
                    </span>
                  </p>
                </div>
                <div className={s.best}>
                  {ready && best ? (
                    <>
                      {t.mock.best}{' '}
                      <strong className="num">{Math.round((best.score / best.maxScore) * 100)}%</strong>
                      <span className="meta">（{t.mock.attempts(runs.length)}）</span>
                    </>
                  ) : (
                    <span className="meta">{t.mock.notTaken}</span>
                  )}
                </div>
                <a className="btn" href={routes.mock(examId, m.slug)}>
                  {t.mock.start}
                </a>
              </li>
            );
          })}
        </ul>
      )}

      {totalQuestions > 0 && (
        <form className={s.custom} action={routes.mock(examId, 'custom')} method="get">
          <p className={s.customTitle}>{t.mock.custom}</p>
          <label className="field">
            <span>{t.mock.questions}</span>
            <input
              className="input num"
              type="number"
              name="n"
              min={1}
              max={totalQuestions}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              style={{ width: '6rem' }}
            />
          </label>
          <label className="field">
            <span>{t.mock.time}（分）</span>
            <input
              className="input num"
              type="number"
              name="min"
              min={1}
              max={300}
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              style={{ width: '6rem' }}
            />
          </label>
          <button type="submit" className="btn btn--ghost">
            {t.mock.start}
          </button>
        </form>
      )}
    </div>
  );
}
