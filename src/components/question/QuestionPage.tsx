import { Bookmark, BookmarkCheck, MessageSquareWarning } from 'lucide-react';

import type { ExamContext, Question } from '../../domain/question';
import { t } from '../../i18n';
import { reportIssueUrl } from '../../config/site';
import { progress } from '../../stores/progress';
import { useProgress } from '../hooks/useProgress';
import { QuestionMeta } from './feedback';
import { TablesButton } from '../tools/Tables';
import { PracticeQuestion } from './PracticeQuestion';
import s from './Question.module.css';

interface Props {
  question: Question;
  exam: ExamContext;
  pageUrl: string;
}

/** Island for the static page of a single question (/exams/<exam>/questions/<slug>/). */
export default function QuestionPage({ question, exam, pageUrl }: Props) {
  const { progress: state, ready } = useProgress();
  const record = state.attempts[question.id];
  const bookmarked = Boolean(state.bookmarks[question.id]);
  const report = reportIssueUrl(
    `[誤り報告] ${exam.shortName} ${t.question.number(question.order)}（${question.id}）`,
    `ページ: ${pageUrl}\n\n## 誤りの内容\n\n## 正しいと思われる内容・根拠\n`,
  );

  const header = (
    <header style={{ display: 'grid', gap: 'var(--s-3)' }}>
      <h1
        style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: 'var(--s-3)' }}
        data-pagefind-meta={`title:${exam.shortName} ${t.question.number(question.order)}`}
      >
        <span className={s.number}>{t.question.number(question.order)}</span>
        <span className="visually-hidden">{exam.shortName}</span>
      </h1>
      <QuestionMeta question={question} exam={exam} />
      {ready && record && <p className={s.history}>{t.question.history(record.attempts, record.correct)}</p>}
    </header>
  );

  const actions = (
    <>
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

  return <PracticeQuestion question={question} exam={exam} header={header} actions={actions} keyboard />;
}
