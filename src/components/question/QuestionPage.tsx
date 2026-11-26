import { Bookmark, BookmarkCheck, MessageSquareWarning } from 'lucide-react';

import { reportIssueUrl } from '../../config/site';
import type { ExamContext, Question } from '../../domain/question';
import { t } from '../../i18n';
import { progress } from '../../stores/progress';
import { useProgress } from '../hooks/useProgress';
import { TablesButton } from '../tools/Tables';
import { PracticeQuestion } from './PracticeQuestion';
import s from './Question.module.css';

interface Props {
  /** Already stripped with answerOnly(): the page renders stem and explanation statically. */
  question: Question;
  exam: ExamContext;
  pageUrl: string;
  /** id of the page's static <details> explanation. */
  explanationId: string;
}

/**
 * Island for the static page of a single question (/exams/<exam>/questions/<slug>/):
 * the answer area, grading, bookmark and report link. Everything readable is plain HTML
 * rendered by the page, so it is not repeated in this island's props.
 */
export default function QuestionPage({ question, exam, pageUrl, explanationId }: Props) {
  const { progress: state, ready } = useProgress();
  const record = state.attempts[question.id];
  const bookmarked = Boolean(state.bookmarks[question.id]);
  const report = reportIssueUrl(
    `[誤り報告] ${exam.shortName} ${t.question.number(question.order)}（${question.id}）`,
    `ページ: ${pageUrl}\n\n## 誤りの内容\n\n## 正しいと思われる内容・根拠\n`,
  );

  const actions = (
    <>
      {ready && record && (
        <span className={s.history}>{t.question.history(record.attempts, record.correct)}</span>
      )}
      <button
        type="button"
        className="btn btn--quiet btn--sm"
        aria-pressed={bookmarked}
        onClick={() => progress.toggleBookmark(question.id)}
      >
        {bookmarked ? <BookmarkCheck size={16} aria-hidden /> : <Bookmark size={16} aria-hidden />}
        {bookmarked ? t.question.bookmarked : t.question.bookmark}
      </button>
      {exam.tables && <TablesButton />}
      {report && (
        <a className="btn btn--quiet btn--sm" href={report} target="_blank" rel="noreferrer">
          <MessageSquareWarning size={16} aria-hidden />
          {t.question.report}
        </a>
      )}
    </>
  );

  return (
    <PracticeQuestion
      question={question}
      exam={exam}
      actions={actions}
      keyboard
      bodyless
      explanationId={explanationId}
    />
  );
}
