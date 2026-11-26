import { ChevronLeft, ChevronRight, Flag, LayoutGrid, Timer } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { grade, isAnswered } from '../../domain/grading';
import type { MockResult } from '../../domain/progress';
import type { ExamContext, Question, QuestionMeta, Response, SelfGrade } from '../../domain/question';
import { createRng, drawFromBlueprint, type BlueprintRow } from '../../domain/sampling';
import { t } from '../../i18n';
import { progress } from '../../stores/progress';
import { StatusMark } from '../exam/QuestionIndex';
import { loadQuestions, useQuestionIndex } from '../hooks/useQuestionData';
import { digitKeys, useShortcuts } from '../hooks/useShortcuts';
import { Explanation, QuestionBody } from '../question/feedback';
import { AnswerInput, emptyResponse, pressChoice } from '../question/inputs';
import { KeyHints } from '../question/KeyHints';
import { outcomeOf } from '../question/PracticeQuestion';
import { TablesButton } from '../tools/Tables';
import q from '../question/Question.module.css';
import s from './Mock.module.css';

export interface MockConfig {
  id: string;
  title: string;
  description: string;
  durationMin: number;
  passingRate: number;
  questions?: string[];
  blueprint?: BlueprintRow[];
}

interface Props {
  exam: ExamContext;
  /** null = custom mock, configured through ?n=<count>&min=<minutes>. */
  mock: MockConfig | null;
  listHref: string;
}

type Phase = 'intro' | 'loading' | 'running' | 'result';

function customConfig(): MockConfig {
  const params = new URLSearchParams(window.location.search);
  const n = Math.max(1, Math.min(200, Number(params.get('n')) || 20));
  const min = Math.max(1, Math.min(300, Number(params.get('min')) || n * 3));
  return {
    id: 'custom',
    title: t.mock.customTitle,
    description: '',
    durationMin: min,
    passingRate: 0.6,
    blueprint: [{ count: n }],
  };
}

function pickQuestions(config: MockConfig, pool: QuestionMeta[]): QuestionMeta[] {
  if (config.questions) {
    const byId = new Map(pool.map((x) => [x.id, x]));
    return config.questions.map((id) => byId.get(id)).filter((x): x is QuestionMeta => Boolean(x));
  }
  return drawFromBlueprint(pool, config.blueprint ?? [], createRng(Date.now())).sort(
    (a, b) => a.order - b.order,
  );
}

function score(
  exam: ExamContext,
  config: MockConfig,
  questions: Question[],
  responses: Record<string, Response>,
  startedAt: number,
  finishedAt: number,
  runId: string,
): MockResult {
  let total = 0;
  let max = 0;
  const byTopic: MockResult['byTopic'] = {};
  const outcomes: MockResult['outcomes'] = {};
  for (const question of questions) {
    const r = responses[question.id];
    const g = r && isAnswered(r) ? grade(question, r) : null;
    const earned = g?.score ?? 0;
    total += earned;
    max += question.points;
    outcomes[question.id] = (g && outcomeOf(g)) ?? 'unanswered';
    for (const topic of question.topics) {
      const row = (byTopic[topic] ??= { score: 0, max: 0 });
      row.score += earned;
      row.max += question.points;
    }
  }
  return {
    id: runId,
    exam: exam.id,
    mockId: config.id,
    title: config.title,
    startedAt: new Date(startedAt).toISOString(),
    finishedAt: new Date(finishedAt).toISOString(),
    durationSec: Math.round((finishedAt - startedAt) / 1000),
    score: total,
    maxScore: max,
    passingRate: config.passingRate,
    passed: max > 0 && total / max >= config.passingRate,
    byTopic,
    outcomes,
  };
}

const clock = (sec: number) => {
  const v = Math.max(0, sec);
  const h = Math.floor(v / 3600);
  const m = Math.floor((v % 3600) / 60);
  const ss = String(v % 60).padStart(2, '0');
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`;
};

/** A timed mock exam: intro → answer sheet with palette & flags → graded result and review. */
export default function MockRunner({ exam, mock, listHref }: Props) {
  const data = useQuestionIndex(exam.id);
  const config = useMemo(() => mock ?? customConfig(), [mock]);
  const [loadFailed, setLoadFailed] = useState(false);

  const [phase, setPhase] = useState<Phase>('intro');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<Record<string, Response>>({});
  const [flags, setFlags] = useState<Set<string>>(new Set());
  const [index, setIndex] = useState(0);
  const [startedAt, setStartedAt] = useState(0);
  const [finishedAt, setFinishedAt] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const [paletteOpen, setPaletteOpen] = useState(true);
  const [runId, setRunId] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  const top = useRef<HTMLDivElement>(null);

  const deadline = startedAt + config.durationMin * 60_000;
  const remaining = Math.round((deadline - now) / 1000);

  const result = useMemo(
    () =>
      phase === 'result' ? score(exam, config, questions, responses, startedAt, finishedAt, runId) : null,
    [phase, exam, config, questions, responses, startedAt, finishedAt, runId],
  );

  // Persist the result whenever it changes (essay self-grading updates it in place).
  useEffect(() => {
    if (result) progress.addMockResult(result);
  }, [result]);

  useEffect(() => {
    if (phase !== 'running') return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('beforeunload', warn);
    };
  }, [phase]);

  useEffect(() => {
    if (phase === 'running' && remaining <= 0) finish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, remaining]);

  useEffect(() => {
    top.current?.scrollIntoView({ block: 'start' });
  }, [index, phase]);

  const start = () => {
    if (data.status !== 'ready') return;
    const picked = pickQuestions(config, data.value);
    setPhase('loading');
    setLoadFailed(false);
    loadQuestions(picked.map((x) => x.id))
      .then((loaded) => {
        setQuestions(loaded);
        setResponses(Object.fromEntries(loaded.map((x) => [x.id, emptyResponse(x)])));
        setFlags(new Set());
        setIndex(0);
        // The clock starts once every question is on the page, not while they download.
        const t0 = Date.now();
        setStartedAt(t0);
        setNow(t0);
        setRunId(`${exam.id}:${config.id}:${t0}`);
        setPhase('running');
      })
      .catch(() => {
        setLoadFailed(true);
        setPhase('intro');
      });
  };

  const current = phase === 'running' ? questions[index] : undefined;
  const toggleFlag = (id: string) =>
    setFlags((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const choiceCount =
    current && (current.format === 'single' || current.format === 'multiple')
      ? current.choicesHtml.length
      : 0;

  useShortcuts(
    {
      ...digitKeys(choiceCount, (n) => {
        if (!current) return;
        const next = pressChoice(current, responses[current.id]!, n);
        if (next) setResponses((prev) => ({ ...prev, [current.id]: next }));
      }),
      arrowleft: () => setIndex((i) => Math.max(0, i - 1)),
      arrowright: () => setIndex((i) => Math.min(questions.length - 1, i + 1)),
      f: () => current && toggleFlag(current.id),
    },
    phase === 'running',
  );

  function finish() {
    dialog.current?.close();
    const t1 = Date.now();
    setFinishedAt(t1);
    for (const question of questions) {
      const r = responses[question.id];
      if (!r || !isAnswered(r)) continue;
      const outcome = outcomeOf(grade(question, r));
      if (outcome) progress.recordAttempt(question.id, outcome);
    }
    setPhase('result');
  }

  const selfGrade = (question: Question, g: SelfGrade) => {
    const r = responses[question.id];
    if (r?.format !== 'essay' || r.selfGrade) return;
    const next: Response = { ...r, selfGrade: g };
    setResponses((prev) => ({ ...prev, [question.id]: next }));
    const outcome = outcomeOf(grade(question, next));
    if (outcome) progress.recordAttempt(question.id, outcome);
  };

  /* ------------------------------ intro ------------------------------ */
  if (phase === 'intro' || phase === 'loading') {
    const available = data.status === 'ready' ? pickQuestions(config, data.value).length : null;
    return (
      <div className={s.intro}>
        <h1 className="section-title">{config.title}</h1>
        {config.description && <p>{config.description}</p>}
        <dl className={s.rules}>
          <div>
            <dt>{t.mock.questions}</dt>
            <dd className="num">{available ?? '—'}問</dd>
          </div>
          <div>
            <dt>{t.mock.time}</dt>
            <dd>{t.mock.minutes(config.durationMin)}</dd>
          </div>
          <div>
            <dt>{t.mock.passLine}</dt>
            <dd>{Math.round(config.passingRate * 100)}%</dd>
          </div>
        </dl>
        <p className="meta">
          開始すると時間の計測が始まり、終了後にまとめて採点します。{t.mock.leaveWarning}
        </p>
        {(data.status === 'error' || loadFailed) && <p className="meta">{t.drill.loadError}</p>}
        <div>
          <button type="button" className="btn" disabled={!available || phase === 'loading'} onClick={start}>
            {phase === 'loading' ? t.drill.loading : t.mock.start}
          </button>
        </div>
      </div>
    );
  }

  /* ------------------------------ result ----------------------------- */
  if (phase === 'result' && result) {
    const ratio = result.maxScore > 0 ? result.score / result.maxScore : 0;
    const hasEssay = questions.some((x) => x.format === 'essay');
    return (
      <div className={s.result} ref={top}>
        <section className={s.scoreCard} aria-label={t.mock.result}>
          <div>
            <p className="eyebrow">{t.mock.result}</p>
            <p className={s.score}>
              {Math.round(ratio * 100)}
              <small>%</small>
            </p>
            <p className={s.scoreMeta}>
              <span className="num">
                {t.mock.scoreLine(Math.round(result.score * 10) / 10, result.maxScore)}
              </span>
              <span>
                {t.mock.passLine} {Math.round(result.passingRate * 100)}%
              </span>
              <span className="num">
                {t.mock.elapsed} {clock(result.durationSec)}
              </span>
            </p>
            {hasEssay && <p className="meta">{t.mock.selfGradeNote}</p>}
          </div>
          <span
            className={`${s.stamp} ${result.passed ? s.stampPass : s.stampFail}`}
            role="img"
            aria-label={result.passed ? t.mock.pass : t.mock.fail}
          >
            {result.passed ? t.mock.pass : t.mock.fail}
          </span>
        </section>

        <section>
          <h2 className="section-title">{t.mock.byTopic}</h2>
          <table className={s.topicTable}>
            <thead>
              <tr>
                <th scope="col">{t.question.topic}</th>
                <th scope="col">得点</th>
                <th scope="col" className={s.topicBar}>
                  <span className="visually-hidden">{t.me.accuracy}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(result.byTopic)
                .sort(([, a], [, b]) => a.score / a.max - b.score / b.max)
                .map(([topic, row]) => (
                  <tr key={topic}>
                    <td>{exam.topics[topic] ?? topic}</td>
                    <td className="num">
                      {Math.round(row.score * 10) / 10} / {row.max}
                    </td>
                    <td className={s.topicBar}>
                      <span className={s.track}>
                        <span className={s.fill} style={{ width: `${(row.score / row.max) * 100}%` }} />
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </section>

        <section>
          <h2 className="section-title">{t.mock.review}</h2>
          {questions.map((question, i) => (
            <ReviewItem
              key={question.id}
              number={i + 1}
              question={question}
              exam={exam}
              response={responses[question.id]!}
              outcome={result.outcomes[question.id]}
              onSelfGrade={(g) => selfGrade(question, g)}
            />
          ))}
        </section>

        <div className={q.actions}>
          <button type="button" className="btn" onClick={() => setPhase('intro')}>
            {t.mock.retake}
          </button>
          <a className="btn btn--ghost" href={listHref}>
            {t.mock.backToList}
          </a>
        </div>
      </div>
    );
  }

  /* ------------------------------ running ---------------------------- */
  if (!current) return null;
  const unanswered = questions.filter((x) => !isAnswered(responses[x.id])).length;
  const flagged = flags.has(current.id);

  return (
    <div ref={top}>
      <div className={s.bar}>
        <span className={s.barTitle}>{config.title}</span>
        <span className="num meta">
          {index + 1} / {questions.length}
        </span>
        <span
          className={`${s.timer} ${remaining <= 300 ? s.timerLow : ''}`}
          role="timer"
          aria-label={`${t.mock.remaining} ${clock(remaining)}`}
        >
          <Timer size={17} aria-hidden />
          {clock(remaining)}
        </span>
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          aria-expanded={paletteOpen}
          onClick={() => setPaletteOpen((v) => !v)}
        >
          <LayoutGrid size={14} aria-hidden /> {t.mock.palette}
        </button>
        {exam.tables && <TablesButton className="btn btn--ghost btn--sm" />}
        <button type="button" className="btn btn--sm" onClick={() => dialog.current?.showModal()}>
          {t.mock.submit}
        </button>
      </div>

      {paletteOpen && (
        <>
          <div className={s.palette} role="navigation" aria-label={t.mock.palette}>
            {questions.map((x, i) => (
              <button
                type="button"
                key={x.id}
                className={[
                  s.cell,
                  isAnswered(responses[x.id]) ? s.cellAnswered : '',
                  i === index ? s.cellCurrent : '',
                  flags.has(x.id) ? s.cellFlag : '',
                ].join(' ')}
                aria-current={i === index ? 'step' : undefined}
                aria-label={`${t.question.number(i + 1)}${isAnswered(responses[x.id]) ? ` ${t.mock.answered}` : ''}${flags.has(x.id) ? ` ${t.mock.flagged}` : ''}`}
                onClick={() => setIndex(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <p className={s.legend}>
            <span>
              {t.mock.answered} {questions.length - unanswered}
            </span>
            <span>
              {t.mock.unanswered} {unanswered}
            </span>
            <span>
              {t.mock.flagged} {flags.size}
            </span>
          </p>
        </>
      )}

      <div className={s.sheet}>
        <div className={s.qhead}>
          <span className={s.qnum}>{t.question.number(index + 1)}</span>
          <span className={s.points}>{current.points}点</span>
        </div>
        <QuestionBody question={current} />
        <AnswerInput
          question={current}
          response={responses[current.id]!}
          onChange={(r) => setResponses((prev) => ({ ...prev, [current.id]: r }))}
          choiceStyle={exam.choiceStyle}
        />
        <div className={s.nav}>
          <button
            type="button"
            className="btn btn--ghost"
            disabled={index === 0}
            onClick={() => setIndex(index - 1)}
          >
            <ChevronLeft size={16} aria-hidden /> {t.mock.prev}
          </button>
          <button
            type="button"
            className={`btn btn--ghost ${flagged ? s.flagOn : ''}`}
            aria-pressed={flagged}
            onClick={() => toggleFlag(current.id)}
          >
            <Flag size={15} aria-hidden /> {flagged ? t.mock.flagged : t.mock.flag}
          </button>
          <span className={q.spacer} />
          {index < questions.length - 1 ? (
            <button type="button" className="btn" onClick={() => setIndex(index + 1)}>
              {t.mock.next} <ChevronRight size={16} aria-hidden />
            </button>
          ) : (
            <button type="button" className="btn" onClick={() => dialog.current?.showModal()}>
              {t.mock.submit}
            </button>
          )}
        </div>
        <KeyHints choices={choiceCount} mock />
      </div>

      <dialog ref={dialog} className={s.dialog} aria-labelledby="mock-confirm">
        <p id="mock-confirm">{t.mock.confirmSubmit(unanswered)}</p>
        <div className={s.dialogButtons}>
          <button type="button" className="btn btn--ghost" onClick={() => dialog.current?.close()}>
            {t.mock.cancel}
          </button>
          <button type="button" className="btn" onClick={finish}>
            {t.mock.submit}
          </button>
        </div>
      </dialog>
    </div>
  );
}

function ReviewItem({
  number,
  question,
  exam,
  response,
  outcome,
  onSelfGrade,
}: {
  number: number;
  question: Question;
  exam: ExamContext;
  response: Response;
  outcome: MockResult['outcomes'][string] | undefined;
  onSelfGrade: (g: SelfGrade) => void;
}) {
  const [open, setOpen] = useState(true);
  const answered = isAnswered(response);
  const earned = answered ? grade(question, response).score : 0;
  const record =
    outcome && outcome !== 'unanswered'
      ? { attempts: 1, correct: outcome === 'correct' ? 1 : 0, last: outcome, lastAt: '', streak: 0 }
      : undefined;

  return (
    <details className={s.reviewItem}>
      <summary>
        <StatusMark record={record} />
        <span className={s.reviewNum}>{t.question.number(number)}</span>
        <span className="meta">{question.topics.map((id) => exam.topics[id] ?? id).join('・')}</span>
        <span className="num meta">
          {Math.round(earned * 10) / 10} / {question.points}
        </span>
      </summary>
      <div className={s.reviewBody}>
        <QuestionBody question={question} />
        {!answered && <p className="meta">{t.mock.noAnswer}</p>}
        <AnswerInput
          question={question}
          response={response}
          onChange={() => {}}
          choiceStyle={exam.choiceStyle}
          locked
          reveal
        />
        <Explanation
          question={question}
          choiceStyle={exam.choiceStyle}
          open={open}
          onToggle={setOpen}
          onSelfGrade={question.format === 'essay' && answered ? onSelfGrade : undefined}
          selfGrade={response.format === 'essay' ? response.selfGrade : undefined}
        />
      </div>
    </details>
  );
}
