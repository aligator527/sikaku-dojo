/**
 * The page the service worker serves for a navigation it cannot fulfil offline.
 * If the requested URL is a question page whose data was saved, the question is rendered
 * from its JSON, so saved exams work offline without storing every page twice.
 */
import { useEffect, useState } from 'react';

import type { ExamContext } from '../../domain/question';
import { t } from '../../i18n';
import { routes } from '../../lib/paths';
import { useQuestion } from '../hooks/useQuestionData';
import { QuestionMeta } from '../question/feedback';
import { PracticeQuestion } from '../question/PracticeQuestion';
import q from '../question/Question.module.css';
import SavedList from './SavedList';

interface ExamInfo extends ExamContext {
  name: string;
}

function useRequestedQuestion(exams: ExamInfo[]) {
  const [match, setMatch] = useState<{ exam: ExamInfo; id: string } | null>(null);
  useEffect(() => {
    const prefix = routes.exams();
    const path = window.location.pathname;
    if (!path.startsWith(prefix)) return;
    const [examId, section, slug] = path.slice(prefix.length).split('/');
    const exam = exams.find((e) => e.id === examId);
    if (exam && section === 'questions' && slug) setMatch({ exam, id: `${examId}/${slug}` });
  }, [exams]);
  return match;
}

export default function OfflineFallback({ exams }: { exams: ExamInfo[] }) {
  const match = useRequestedQuestion(exams);
  const question = useQuestion(match?.id);

  useEffect(() => {
    if (question.status === 'ready' && match)
      document.title = `${match.exam.shortName} ${t.question.number(question.value.order)}｜${t.site.name}`;
  }, [question, match]);

  if (match && question.status === 'ready') {
    const { exam } = match;
    return (
      <div>
        <p className="meta">
          <a href={routes.questions(exam.id)}>
            {exam.name} {t.examTabs.questions}
          </a>
        </p>
        <PracticeQuestion
          question={question.value}
          exam={exam}
          keyboard
          header={
            <header style={{ display: 'grid', gap: 'var(--s-3)' }}>
              <h1>
                <span className={q.number}>{t.question.number(question.value.order)}</span>
              </h1>
              <QuestionMeta question={question.value} exam={exam} />
            </header>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <h1 className="offline-title">{t.offline.pageTitle}</h1>
      <p className="meta offline-lead">{t.offline.pageLead}</p>
      <h2 className="section-title">{t.offline.savedList}</h2>
      <SavedList exams={exams.map((e) => ({ id: e.id, name: e.name, href: routes.exam(e.id) }))} />
      <p className="offline-links">
        <a href={routes.me()}>{t.me.title}</a>
        <a href={routes.tables()}>{t.tools.tables.title}</a>
      </p>
    </div>
  );
}
