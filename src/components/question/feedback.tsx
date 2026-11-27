import { ChevronRight, Circle, X } from 'lucide-react';
import type { ReactNode } from 'react';

import type { ChoiceStyle } from '../../config/catalog';
import type { Grade } from '../../domain/grading';
import { choiceLabel, DIFFICULTY_LABEL, FORMAT_LABEL, SOURCE_KIND_LABEL } from '../../domain/labels';
import type { ExamContext, Question, SelfGrade } from '../../domain/question';
import { t } from '../../i18n';
import { AnswerTables, JournalTable } from './inputs';
import s from './Question.module.css';

export function QuestionMeta({
  question,
  exam,
  topicHref,
}: {
  question: Question;
  exam: ExamContext;
  /** Link each topic tag (the static question page links to the topic's question list). */
  topicHref?: (topicId: string) => string;
}) {
  const { source } = question;
  return (
    <div className={s.meta}>
      {question.topics.map((id) =>
        topicHref ? (
          <a className="tag tag--link" key={id} href={topicHref(id)}>
            {exam.topics[id] ?? id}
          </a>
        ) : (
          <span className="tag" key={id}>
            {exam.topics[id] ?? id}
          </span>
        ),
      )}
      <span className={source.kind === 'past' ? 'tag tag--past' : 'tag'} title={source.note}>
        {source.label ?? SOURCE_KIND_LABEL[source.kind]}
        {source.kind === 'adapted' && `（${SOURCE_KIND_LABEL.adapted}）`}
      </span>
      <span className="tag">
        {t.question.difficulty} {DIFFICULTY_LABEL[question.difficulty]}
      </span>
      {question.format !== 'single' && <span className="tag">{FORMAT_LABEL[question.format]}</span>}
    </div>
  );
}

export function QuestionBody({ question }: { question: Question }) {
  return (
    <>
      {question.passageHtml && (
        <div className={s.passage}>
          <span className={s.passageLabel}>{t.question.passage}</span>
          <div className="prose prose--tight" dangerouslySetInnerHTML={{ __html: question.passageHtml }} />
        </div>
      )}
      <div
        className={`${s.stem} prose prose--tight`}
        dangerouslySetInnerHTML={{ __html: question.stemHtml }}
      />
    </>
  );
}

/** "正解は ③" — or the full 仕訳 table for journal questions. */
export function AnswerKey({ question, choiceStyle }: { question: Question; choiceStyle: ChoiceStyle }) {
  let value: ReactNode;
  switch (question.format) {
    case 'single':
      value = choiceLabel(choiceStyle, question.answer);
      break;
    case 'multiple':
      value = question.answer.map((n) => choiceLabel(choiceStyle, n)).join('・');
      break;
    case 'numeric':
      value = `${question.answer.value.toLocaleString('ja-JP', { maximumFractionDigits: 10 })}${question.answer.unit ?? ''}`;
      break;
    case 'journal':
      return (
        <div className={s.answerKey} style={{ display: 'grid', width: '100%' }}>
          <span className={s.answerKeyLabel}>{t.question.answerIs}</span>
          <JournalTable entry={question.answer} />
        </div>
      );
    case 'table':
      return (
        <div className={s.answerKey} style={{ display: 'grid', width: '100%' }}>
          <span className={s.answerKeyLabel}>{t.question.answerIs}</span>
          <AnswerTables question={question} />
        </div>
      );
    case 'essay':
      return null;
  }
  return (
    <p className={s.answerKey}>
      <span className={s.answerKeyLabel}>{t.question.answerIs}</span>
      <span className={`${s.answerKeyValue} num`}>{value}</span>
    </p>
  );
}

export function Verdict({
  question,
  grade,
  choiceStyle,
}: {
  question: Question;
  grade: Grade;
  choiceStyle: ChoiceStyle;
}) {
  if (grade.correct === null) return null;
  const ok = grade.correct;
  const partial = !ok && grade.score > 0;
  return (
    <div className={`${s.verdict} ${ok ? s.verdictOk : s.verdictNg}`} role="status">
      <span className={s.verdictWord}>
        {ok ? (
          <Circle size={26} strokeWidth={2.8} aria-hidden />
        ) : (
          <X size={26} strokeWidth={2.8} aria-hidden />
        )}
        {ok ? t.question.correct : partial ? t.question.partial : t.question.incorrect}
      </span>
      {grade.cells && (
        <span className={`${s.cellsLine} num`}>
          {t.question.table.cells(grade.cells.correct, grade.cells.total)}
        </span>
      )}
      {/* Table questions mark each box in place, so the verdict does not repeat the whole table. */}
      {!ok && question.format !== 'essay' && question.format !== 'table' && (
        <AnswerKey question={question} choiceStyle={choiceStyle} />
      )}
    </div>
  );
}

interface ExplanationProps {
  question: Question;
  choiceStyle: ChoiceStyle;
  /** Controlled mode (drills, mocks). Leave both out to render a plain, JavaScript-free <details>. */
  open?: boolean;
  onToggle?: (open: boolean) => void;
  /** Lets an island elsewhere on the page open this block (see PracticeQuestion's explanationId). */
  id?: string;
  /** Essay only: called with the learner's self-assessment. */
  onSelfGrade?: (grade: SelfGrade) => void;
  selfGrade?: SelfGrade;
  /** Hide the "正解は …" line when a verdict above already shows it. */
  hideAnswerKey?: boolean;
}

export function SelfGradeButtons({
  onSelfGrade,
  selfGrade,
}: {
  onSelfGrade: (grade: SelfGrade) => void;
  selfGrade?: SelfGrade;
}) {
  return (
    <div className={s.selfGrade}>
      <p className="meta">{t.question.selfGradePrompt}</p>
      <div className={s.selfGradeButtons}>
        {(['good', 'partial', 'poor'] as const).map((g) => (
          <button
            key={g}
            type="button"
            className={selfGrade === g ? 'btn btn--sm' : 'btn btn--ghost btn--sm'}
            aria-pressed={selfGrade === g}
            onClick={() => onSelfGrade(g)}
          >
            {t.question.selfGrade[g]}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Answer + explanation inside a native <details>: readable without JavaScript and
 * present in the static HTML (so it is indexed by site search and search engines).
 * The summary label follows the open state through CSS, so it also works unhydrated.
 */
export function Explanation({
  question,
  choiceStyle,
  open,
  onToggle,
  id,
  onSelfGrade,
  selfGrade,
  hideAnswerKey = false,
}: ExplanationProps) {
  const controlled = onToggle !== undefined;
  return (
    <details
      id={id}
      className={s.explain}
      {...(controlled ? { open, onToggle: (e) => onToggle(e.currentTarget.open) } : {})}
    >
      <summary>
        <ChevronRight size={16} aria-hidden />
        <span className={s.whenClosed}>{t.question.showAnswer}</span>
        <span className={s.whenOpen}>{t.question.hideAnswer}</span>
      </summary>
      <div className={s.explainBody}>
        {question.format === 'essay' ? (
          <>
            <section>
              <h3 className={s.explainTitle}>{t.question.modelAnswer}</h3>
              <div
                className={`${s.modelAnswer} prose prose--tight`}
                dangerouslySetInnerHTML={{ __html: question.modelAnswerHtml }}
              />
            </section>
            {question.rubric.length > 0 && (
              <section>
                <h3 className={s.explainTitle}>{t.question.rubric}</h3>
                <ul className={s.rubric}>
                  {question.rubric.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </section>
            )}
            {onSelfGrade && <SelfGradeButtons onSelfGrade={onSelfGrade} selfGrade={selfGrade} />}
          </>
        ) : (
          !hideAnswerKey && <AnswerKey question={question} choiceStyle={choiceStyle} />
        )}
        {question.explanationHtml.trim() && (
          <section>
            <h3 className={s.explainTitle}>{t.question.explanation}</h3>
            <div className="prose" dangerouslySetInnerHTML={{ __html: question.explanationHtml }} />
          </section>
        )}
      </div>
    </details>
  );
}
