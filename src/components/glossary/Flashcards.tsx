import { useEffect, useMemo, useState } from 'react';

import { dueCards, toDateKey } from '../../domain/progress';
import { t } from '../../i18n';
import type { CardTerm } from '../../lib/content/glossary';
import { routes } from '../../lib/paths';
import { progress as actions } from '../../stores/progress';
import { useProgress } from '../hooks/useProgress';
import s from './Flashcards.module.css';

const NEW_PER_SESSION = 15;

/** Renders a card's formula with KaTeX, loaded the first time a card with a formula is turned. */
function Formula({ tex }: { tex: string }) {
  const [html, setHtml] = useState<string | null>(null);
  useEffect(() => {
    let live = true;
    void import('katex').then(({ default: katex }) => {
      if (live)
        setHtml(
          katex.renderToString(tex, {
            displayMode: true,
            throwOnError: false,
            strict: false,
            output: 'htmlAndMathml',
          }),
        );
    });
    return () => {
      live = false;
    };
  }, [tex]);
  return html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null;
}

/** 用語カード — Leitner-box flashcards over the glossary. */
export default function Flashcards({ exams }: { exams: { id: string; name: string }[] }) {
  const { progress, ready } = useProgress();
  const [terms, setTerms] = useState<CardTerm[] | null>(null);
  const [exam, setExam] = useState(() => new URLSearchParams(window.location.search).get('exam') ?? '');
  const [queue, setQueue] = useState<string[] | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [retried, setRetried] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch(routes.glossaryData())
      .then((r) => r.json() as Promise<CardTerm[]>)
      .then(setTerms)
      .catch(() => setTerms([]));
  }, []);

  const pool = useMemo(() => (terms ?? []).filter((x) => !exam || x.exams.includes(exam)), [terms, exam]);
  const today = toDateKey(new Date());

  // Build the session queue once data and progress are available, and whenever the exam filter changes.
  useEffect(() => {
    if (!terms || !ready) return;
    const ids = pool.map((x) => x.id);
    const due = dueCards(progress, ids, today);
    const reviews = due.filter((id) => progress.cards[id]);
    const fresh = due.filter((id) => !progress.cards[id]).slice(0, NEW_PER_SESSION);
    setQueue([...reviews, ...fresh]);
    setFlipped(false);
    setRetried(new Set());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [terms, ready, exam]);

  const currentId = queue?.[0];
  const current = pool.find((x) => x.id === currentId);

  const answer = (remembered: boolean) => {
    if (!currentId || !queue) return;
    actions.reviewCard(currentId, remembered);
    const rest = queue.slice(1);
    // A forgotten card comes back once at the end of this session.
    if (!remembered && !retried.has(currentId)) {
      setRetried(new Set(retried).add(currentId));
      rest.push(currentId);
    }
    setQueue(rest);
    setFlipped(false);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!current || (e.target as HTMLElement).closest('input, select, textarea')) return;
      if (e.key === ' ') {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (flipped && e.key === '1') answer(false);
      else if (flipped && e.key === '2') answer(true);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const reviewsLeft = queue?.filter((id) => progress.cards[id]).length ?? 0;
  const newLeft = (queue?.length ?? 0) - reviewsLeft;

  return (
    <div className={s.wrap}>
      <div className={s.toolbar}>
        <label className="field">
          <span>{t.glossary.examFilter}</span>
          <select className="select" value={exam} onChange={(e) => setExam(e.target.value)}>
            <option value="">{t.glossary.allExams}</option>
            {exams.map((x) => (
              <option key={x.id} value={x.id}>
                {x.name}
              </option>
            ))}
          </select>
        </label>
        <p className={s.counts}>
          <span>{t.glossary.due(reviewsLeft)}</span>
          <span>{t.glossary.newCards(newLeft)}</span>
        </p>
      </div>

      {!queue ? (
        <p className="meta">{t.common.loading}</p>
      ) : !current ? (
        <div className={s.card}>
          <p>{t.glossary.doneToday}</p>
          <a href={routes.glossary()}>{t.glossary.title}</a>
        </div>
      ) : (
        <>
          <div className={s.card} aria-live="polite">
            <p className={s.box}>{t.glossary.box(progress.cards[current.id]?.box ?? 0)}</p>
            <p className={s.term}>{current.term}</p>
            {flipped && (
              <div className={s.back}>
                <p className={s.reading}>
                  {current.reading}
                  {current.en && <span className={s.en}>　{current.en}</span>}
                </p>
                <p>{current.summary}</p>
                {current.formula && <Formula tex={current.formula} />}
                <a href={routes.term(current.id)} target="_blank" rel="noreferrer" className="meta">
                  詳しい解説
                </a>
              </div>
            )}
          </div>
          <div className={s.buttons}>
            {flipped ? (
              <>
                <button type="button" className="btn btn--ghost" onClick={() => answer(false)}>
                  {t.glossary.forgot}
                </button>
                <button type="button" className="btn" onClick={() => answer(true)}>
                  {t.glossary.remembered}
                </button>
              </>
            ) : (
              <button type="button" className="btn" onClick={() => setFlipped(true)}>
                {t.glossary.flip}
              </button>
            )}
          </div>
          <p className={s.keys}>
            <kbd>Space</kbd> めくる　<kbd>1</kbd> まだ　<kbd>2</kbd> 覚えていた
          </p>
        </>
      )}
    </div>
  );
}
