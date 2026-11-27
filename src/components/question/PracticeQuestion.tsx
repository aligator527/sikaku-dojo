import { RotateCcw } from 'lucide-react';
import { useCallback, useEffect, useState, type ReactNode } from 'react';

import { grade as gradeResponse, isAnswered, type Grade } from '../../domain/grading';
import type { Outcome } from '../../domain/progress';
import type { ExamContext, Question, Response, SelfGrade } from '../../domain/question';
import { t } from '../../i18n';
import { progress } from '../../stores/progress';
import { digitKeys, useShortcuts } from '../hooks/useShortcuts';
import { Explanation, QuestionBody, SelfGradeButtons, Verdict } from './feedback';
import { AnswerInput, emptyResponse, pressChoice } from './inputs';
import { KeyHints } from './KeyHints';
import s from './Question.module.css';

export function outcomeOf(grade: Grade): Outcome | null {
  if (grade.correct === null) return null;
  if (grade.correct) return 'correct';
  return grade.score > 0 ? 'partial' : 'incorrect';
}

interface Props {
  question: Question;
  exam: ExamContext;
  /** Rendered above the question (number, meta tags …). */
  header?: ReactNode;
  /** Extra controls in the action row (bookmark, next …). */
  actions?: ReactNode;
  /** Save attempts to learner progress. */
  record?: boolean;
  onGraded?: (grade: Grade) => void;
  /** Enable keyboard shortcuts (digits choose, Enter submits, E toggles the explanation). */
  keyboard?: boolean;
  /** Called by Enter / → once the question is graded (the drill's "next"). */
  onNext?: () => void;
  /**
   * The static question page renders the stem and the explanation as plain HTML around this island
   * (so the content is not shipped twice). Then the island renders only the answer area, and drives
   * the page's <details id={explanationId}> instead of its own.
   */
  bodyless?: boolean;
  explanationId?: string;
}

/** Open state of either our own explanation or a <details> elsewhere on the page. */
function useExplanationOpen(
  elementId: string | undefined,
): [boolean, (open: boolean | ((v: boolean) => boolean)) => void] {
  const [open, setOpenState] = useState(false);

  useEffect(() => {
    if (!elementId) return;
    const el = document.getElementById(elementId) as HTMLDetailsElement | null;
    if (!el) return;
    const sync = () => setOpenState(el.open);
    sync();
    el.addEventListener('toggle', sync);
    return () => el.removeEventListener('toggle', sync);
  }, [elementId]);

  const setOpen = useCallback(
    (next: boolean | ((v: boolean) => boolean)) => {
      const el = elementId ? (document.getElementById(elementId) as HTMLDetailsElement | null) : null;
      if (el) el.open = typeof next === 'function' ? next(el.open) : next;
      else setOpenState(next);
    },
    [elementId],
  );
  return [open, setOpen];
}

/**
 * One question in study mode: answer → immediate ◯/× → explanation.
 * Single-choice questions are graded as soon as a choice is picked, like a paper drill.
 */
export function PracticeQuestion({
  question,
  exam,
  header,
  actions,
  record = true,
  onGraded,
  keyboard = false,
  onNext,
  bodyless = false,
  explanationId,
}: Props) {
  const [response, setResponse] = useState<Response>(() => emptyResponse(question));
  const [result, setResult] = useState<Grade | null>(null);
  const [open, setOpen] = useExplanationOpen(explanationId);
  // The verdict repeats the answer key, except for tables (marked box by box in place).
  const hideAnswerKey = result !== null && result.correct === false && question.format !== 'table';

  // The page's static explanation hides its "正解は …" line while the verdict shows it.
  useEffect(() => {
    const el = explanationId ? document.getElementById(explanationId) : null;
    if (!el) return;
    if (hideAnswerKey) el.dataset.hideKey = '';
    else delete el.dataset.hideKey;
  }, [explanationId, hideAnswerKey]);

  const finish = (r: Response) => {
    const g = gradeResponse(question, r);
    setResult(g);
    setOpen(true);
    const outcome = outcomeOf(g);
    if (outcome) {
      if (record) progress.recordAttempt(question.id, outcome);
      onGraded?.(g);
    }
  };

  const onChange = (r: Response) => {
    setResponse(r);
    if (question.format === 'single' && r.format === 'single' && r.choice > 0) finish(r);
  };

  const onSelfGrade = (selfGrade: SelfGrade) => {
    if (response.format !== 'essay' || response.selfGrade) return;
    const r: Response = { ...response, selfGrade };
    setResponse(r);
    finish(r);
  };

  const retry = () => {
    setResponse(emptyResponse(question));
    setResult(null);
    setOpen(false);
  };

  const locked = result !== null && result.correct !== null;
  const needsSubmit = question.format !== 'single' && question.format !== 'essay';
  const choiceCount =
    question.format === 'single' || question.format === 'multiple' ? question.choicesHtml.length : 0;

  useShortcuts(
    {
      ...digitKeys(choiceCount, (n) => {
        if (locked) return;
        const next = pressChoice(question, response, n);
        if (next) onChange(next);
      }),
      enter: () => {
        if (locked) onNext?.();
        else if (needsSubmit && isAnswered(response)) finish(response);
      },
      arrowright: () => {
        if (locked) onNext?.();
      },
      e: () => setOpen((v) => !v),
    },
    keyboard,
  );

  // Bodyless: the page's <article> is the grid; this island's children join it.
  const Wrapper = bodyless ? 'div' : 'article';
  return (
    <Wrapper className={bodyless ? s.contents : s.question}>
      {!bodyless && header}
      {!bodyless && <QuestionBody question={question} />}
      <AnswerInput
        question={question}
        response={response}
        onChange={onChange}
        choiceStyle={exam.choiceStyle}
        locked={locked}
        reveal={locked}
      />
      <div className={s.actions}>
        {needsSubmit && !locked && (
          <button
            type="button"
            className="btn"
            disabled={!isAnswered(response)}
            onClick={() => finish(response)}
          >
            {t.question.submit}
          </button>
        )}
        {locked && (
          <button type="button" className="btn btn--ghost" onClick={retry}>
            <RotateCcw size={15} aria-hidden /> {t.question.retry}
          </button>
        )}
        <span className={s.spacer} />
        {actions}
      </div>
      {keyboard && <KeyHints choices={choiceCount} next={Boolean(onNext)} />}
      {result && <Verdict question={question} grade={result} choiceStyle={exam.choiceStyle} />}
      {explanationId ? (
        question.format === 'essay' &&
        open && (
          <SelfGradeButtons
            onSelfGrade={onSelfGrade}
            selfGrade={response.format === 'essay' ? response.selfGrade : undefined}
          />
        )
      ) : (
        <Explanation
          question={question}
          choiceStyle={exam.choiceStyle}
          open={open}
          onToggle={setOpen}
          onSelfGrade={question.format === 'essay' ? onSelfGrade : undefined}
          selfGrade={response.format === 'essay' ? response.selfGrade : undefined}
          hideAnswerKey={hideAnswerKey}
        />
      )}
    </Wrapper>
  );
}
