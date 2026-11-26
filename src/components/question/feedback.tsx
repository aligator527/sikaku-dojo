import { ChevronRight, Circle, X } from 'lucide-react';
import type { ReactNode } from 'react';

import type { ChoiceStyle } from '../../config/catalog';
import type { Grade } from '../../domain/grading';
import { choiceLabel, DIFFICULTY_LABEL, FORMAT_LABEL, SOURCE_KIND_LABEL } from '../../domain/labels';
import type { ExamContext, Question, SelfGrade } from '../../domain/question';
import { t } from '../../i18n';
import { JournalTable } from './inputs';
import s from './Question.module.css';

export function QuestionMeta({ question, exam }: { question: Question; exam: ExamContext }) {
  const { source } = question;
  return (
    <div className={s.meta}>
      {question.topics.map((id) => (
        <span className="tag" key={id}>
          {exam.topics[id] ?? id}
        </span>
      ))}
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
      {!ok && question.format !== 'essay' && <AnswerKey question={question} choiceStyle={choiceStyle} />}
    </div>
  );
}

interface ExplanationProps {
  question: Question;
  choiceStyle: ChoiceStyle;
  open: boolean;
  onToggle: (open: boolean) => void;
  /** Essay only: called with the learner's self-assessment. */
  onSelfGrade?: (grade: SelfGrade) => void;
  selfGrade?: SelfGrade;
  /** Hide the "正解は …" line when a verdict above already shows it. */
  hideAnswerKey?: boolean;
}

/**
 * Answer + explanation inside a native <details>: readable without JavaScript and
 * present in the static HTML (so it is indexed by site search).
 */
export function Explanation({
  question,
  choiceStyle,
  open,
  onToggle,
  onSelfGrade,
  selfGrade,
  hideAnswerKey = false,
}: ExplanationProps) {
  return (
    <details className={s.explain} open={open} onToggle={(e) => onToggle(e.currentTarget.open)}>
      <summary>
        <ChevronRight size={16} aria-hidden />
        {open ? t.question.hideAnswer : t.question.showAnswer}
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
            {onSelfGrade && (
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
            )}
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
