import { ArrowRight } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import type { Grade } from '../../domain/grading';
import { SOURCE_KIND_LABEL } from '../../domain/labels';
import { toDateKey, type ProgressState } from '../../domain/progress';
import type { ExamContext, QuestionMeta as Meta, SourceKind } from '../../domain/question';
import { createRng, shuffle } from '../../domain/sampling';
import { t } from '../../i18n';
import { questionHref } from '../../lib/paths';
import { StatusMark } from '../exam/QuestionIndex';
import { useProgress } from '../hooks/useProgress';
import { prefetchQuestion, useQuestion, useQuestionIndex } from '../hooks/useQuestionData';
import { QuestionMeta } from '../question/feedback';
import { outcomeOf, PracticeQuestion } from '../question/PracticeQuestion';
import { TablesButton } from '../tools/Tables';
import s from './Drill.module.css';

type Scope = keyof typeof t.drill.scopes;
type Order = keyof typeof t.drill.orders;

interface Settings {
  topics: string[];
  scope: Scope;
  sources: SourceKind[];
  count: number; // 0 = all
  order: Order;
}

interface Props {
  exam: ExamContext;
  groups: { group?: string; topics: { id: string; name: string }[] }[];
}

function matches(q: Meta, s: Settings, p: ProgressState, today: string): boolean {
  if (!q.topics.some((t) => s.topics.includes(t))) return false;
  if (!s.sources.includes(q.source.kind)) return false;
  const rec = p.attempts[q.id];
  switch (s.scope) {
    case 'all':
      return true;
    case 'review':
      return Boolean(rec?.review && rec.review.due <= today);
    case 'unanswered':
      return !rec;
    case 'incorrect':
      return Boolean(rec && rec.last !== 'correct');
    case 'bookmarked':
      return Boolean(p.bookmarks[q.id]);
  }
}

const isScope = (v: string | null): v is Scope => v !== null && v in t.drill.scopes;

/** 分野別演習: configure → answer one by one with instant feedback → summary. */
export default function DrillApp({ exam, groups }: Props) {
  const data = useQuestionIndex(exam.id);
  const { progress, ready } = useProgress();
  const top = useRef<HTMLDivElement>(null);
  const today = toDateKey(new Date());

  const allTopics = useMemo(() => groups.flatMap((g) => g.topics.map((t) => t.id)), [groups]);
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const [settings, setSettings] = useState<Settings>(() => {
    const requested = params.get('topic');
    const scope = params.get('scope');
    return {
      topics: requested && allTopics.includes(requested) ? [requested] : allTopics,
      scope: isScope(scope) ? scope : 'all',
      sources: ['past', 'adapted', 'original'],
      count: scope === 'review' ? 0 : 10,
      order: 'random',
    };
  });

  const [session, setSession] = useState<Meta[] | null>(null);
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<Record<string, Grade>>({});
  const [done, setDone] = useState(false);
  const autoStarted = useRef(false);

  const current = session && !done ? session[index] : undefined;
  const question = useQuestion(current?.id);

  useEffect(() => {
    top.current?.scrollIntoView({ block: 'start' });
  }, [index, done, session]);

  // Fetch the next question while the learner works on this one.
  useEffect(() => prefetchQuestion(session?.[index + 1]?.id), [session, index]);

  const questions = data.status === 'ready' ? data.value : [];
  const pool = questions.filter((q) => matches(q, settings, progress, today));

  const start = (list: Meta[]) => {
    const ordered =
      settings.order === 'random'
        ? shuffle(list, createRng(Date.now()))
        : [...list].sort((a, b) => a.order - b.order);
    setSession(settings.count > 0 ? ordered.slice(0, settings.count) : ordered);
    setIndex(0);
    setResults({});
    setDone(false);
  };

  // "?scope=review&start=1" (from 今日の復習) starts right away once progress is loaded.
  useEffect(() => {
    if (autoStarted.current || !ready || data.status !== 'ready' || params.get('start') !== '1') return;
    autoStarted.current = true;
    if (pool.length > 0) start(pool);
  });

  if (data.status === 'loading') return <p className="meta">{t.drill.loading}</p>;
  if (data.status === 'error') return <p className="meta">{t.drill.loadError}</p>;

  const usedSources = [...new Set(questions.map((q) => q.source.kind))];
  const countByTopic = (id: string) => questions.filter((q) => q.topics.includes(id)).length;

  const set = <K extends keyof Settings>(key: K, value: Settings[K]) =>
    setSettings((prev) => ({ ...prev, [key]: value }));
  const toggleIn = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  /* ---------------- summary ---------------- */
  if (session && done) {
    const correct = session.filter((q) => results[q.id]?.correct).length;
    const wrong = session.filter((q) => results[q.id] && !results[q.id]!.correct);
    return (
      <div className={s.summary} ref={top}>
        <h2 className="section-title">{t.drill.summary}</h2>
        <div className={s.scoreLine}>
          <span className={s.scoreBig}>
            {session.length > 0 ? Math.round((correct / session.length) * 100) : 0}%
          </span>
          <span>{t.drill.score(correct, session.length)}</span>
        </div>
        <ol className={s.resultList}>
          {session.map((q) => {
            const g = results[q.id];
            const o = g ? outcomeOf(g) : null;
            return (
              <li key={q.id}>
                <StatusMark
                  record={
                    o
                      ? { attempts: 1, correct: o === 'correct' ? 1 : 0, last: o, lastAt: '', streak: 0 }
                      : undefined
                  }
                />
                <a href={questionHref(q.id)}>{t.question.number(q.order)}</a>
                <span className="meta">{q.topics.map((id) => exam.topics[id] ?? id).join('・')}</span>
              </li>
            );
          })}
        </ol>
        <div className={s.buttons}>
          {wrong.length > 0 && (
            <button type="button" className="btn" onClick={() => start(wrong)}>
              {t.drill.retryWrong}（{wrong.length}）
            </button>
          )}
          <button type="button" className="btn btn--ghost" onClick={() => setSession(null)}>
            {t.drill.again}
          </button>
        </div>
      </div>
    );
  }

  /* ---------------- session ---------------- */
  if (session) {
    const meta = session[index]!;
    const graded = Boolean(results[meta.id]);
    const last = index === session.length - 1;
    const next = () => (last ? setDone(true) : setIndex(index + 1));
    return (
      <div ref={top}>
        <div className={s.sessionBar}>
          <span className={`${s.counter} num`}>{t.drill.progress(index + 1, session.length)}</span>
          <span className={s.track} aria-hidden>
            <span
              className={s.fill}
              style={{ width: `${((index + (graded ? 1 : 0)) / session.length) * 100}%` }}
            />
          </span>
          {exam.tables && <TablesButton />}
          <button type="button" className="btn btn--quiet btn--sm" onClick={() => setDone(true)}>
            {t.drill.quit}
          </button>
        </div>
        <div className={s.session}>
          {question.status === 'loading' && <p className="meta">{t.drill.loading}</p>}
          {question.status === 'error' && <p className="meta">{t.drill.loadError}</p>}
          {question.status === 'ready' && (
            <PracticeQuestion
              key={meta.id}
              question={question.value}
              exam={exam}
              keyboard
              onNext={graded ? next : undefined}
              header={
                <div className={s.qhead}>
                  <a className={s.qnum} href={questionHref(meta.id)} target="_blank" rel="noreferrer">
                    {t.question.number(meta.order)}
                  </a>
                  <QuestionMeta question={question.value} exam={exam} />
                </div>
              }
              onGraded={(g) => setResults((r) => ({ ...r, [meta.id]: g }))}
              actions={
                graded && (
                  <button type="button" className="btn" onClick={next}>
                    {last ? t.drill.finish : t.drill.next}
                    <ArrowRight size={15} aria-hidden />
                  </button>
                )
              }
            />
          )}
        </div>
      </div>
    );
  }

  /* ---------------- setup ---------------- */
  return (
    <form
      className={s.setup}
      ref={top as unknown as React.RefObject<HTMLFormElement>}
      onSubmit={(e) => {
        e.preventDefault();
        start(pool);
      }}
    >
      <fieldset className={s.fieldset}>
        <legend className={s.legend}>
          {t.drill.topics}
          <span className={s.legendActions}>
            <button type="button" className="btn btn--quiet btn--sm" onClick={() => set('topics', allTopics)}>
              {t.list.all}
            </button>
            <button type="button" className="btn btn--quiet btn--sm" onClick={() => set('topics', [])}>
              解除
            </button>
          </span>
        </legend>
        {groups.map((g) => (
          <div className={s.group} key={g.group ?? g.topics[0]?.id}>
            {g.group && <p className={s.groupName}>{g.group}</p>}
            <div className={s.options}>
              {g.topics.map((topic) => (
                <label
                  className={`${s.option} ${countByTopic(topic.id) === 0 ? s.optionEmpty : ''}`}
                  key={topic.id}
                >
                  <input
                    type="checkbox"
                    checked={settings.topics.includes(topic.id)}
                    onChange={() => set('topics', toggleIn(settings.topics, topic.id))}
                  />
                  {topic.name}
                  <span className={`${s.optionCount} num`}>{countByTopic(topic.id)}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </fieldset>

      <fieldset className={s.fieldset}>
        <legend className={s.legend}>{t.drill.scope}</legend>
        <div className={s.options}>
          {(Object.keys(t.drill.scopes) as Scope[]).map((k) => (
            <label className={s.option} key={k}>
              <input
                type="radio"
                name="scope"
                checked={settings.scope === k}
                onChange={() => set('scope', k)}
              />
              {t.drill.scopes[k]}
            </label>
          ))}
        </div>
      </fieldset>

      {usedSources.length > 1 && (
        <fieldset className={s.fieldset}>
          <legend className={s.legend}>{t.drill.sources}</legend>
          <div className={s.options}>
            {usedSources.map((k) => (
              <label className={s.option} key={k}>
                <input
                  type="checkbox"
                  checked={settings.sources.includes(k)}
                  onChange={() => set('sources', toggleIn(settings.sources, k))}
                />
                {SOURCE_KIND_LABEL[k]}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--s-6)' }}>
        <fieldset className={s.fieldset}>
          <legend className={s.legend}>{t.drill.count}</legend>
          <div className={s.options}>
            {[5, 10, 20, 0].map((n) => (
              <label className={s.option} key={n}>
                <input
                  type="radio"
                  name="count"
                  checked={settings.count === n}
                  onChange={() => set('count', n)}
                />
                {n === 0 ? t.drill.countAll : `${n}問`}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className={s.fieldset}>
          <legend className={s.legend}>{t.drill.order}</legend>
          <div className={s.options}>
            {(Object.keys(t.drill.orders) as Order[]).map((k) => (
              <label className={s.option} key={k}>
                <input
                  type="radio"
                  name="order"
                  checked={settings.order === k}
                  onChange={() => set('order', k)}
                />
                {t.drill.orders[k]}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className={s.startRow}>
        <button type="submit" className="btn" disabled={pool.length === 0}>
          {t.drill.start}
        </button>
        <span className={s.matching}>{pool.length > 0 ? t.drill.matching(pool.length) : t.drill.none}</span>
      </div>
    </form>
  );
}
