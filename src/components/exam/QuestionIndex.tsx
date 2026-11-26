import { Bookmark, Circle, Minus, Triangle, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { DIFFICULTY_LABEL, SOURCE_KIND_LABEL } from '../../domain/labels';
import type { Difficulty, SourceKind } from '../../domain/question';
import { toDateKey, type AttemptRecord } from '../../domain/progress';
import { t } from '../../i18n';
import { useProgress } from '../hooks/useProgress';
import s from './Exam.module.css';

export interface QuestionRow {
  id: string;
  order: number;
  href: string;
  excerpt: string;
  topics: string[];
  source: { kind: SourceKind; label?: string };
  difficulty: Difficulty;
  section?: string;
}

type StatusFilter = keyof typeof t.drill.scopes;

const PAGE = 50;

export function StatusMark({ record }: { record: AttemptRecord | undefined }) {
  if (!record) return <Minus size={14} className={s.none} aria-label={t.list.unanswered} />;
  if (record.last === 'correct')
    return <Circle size={16} strokeWidth={2.6} className={s.ok} aria-label={t.question.correct} />;
  if (record.last === 'partial')
    return <Triangle size={15} strokeWidth={2.4} className={s.partial} aria-label={t.question.partial} />;
  return <X size={17} strokeWidth={2.6} className={s.ng} aria-label={t.question.incorrect} />;
}

/** 問題一覧 — a filterable index of one exam's questions with the learner's last result. */
export default function QuestionIndex({
  rows,
  topics,
  sections = {},
}: {
  rows: QuestionRow[];
  topics: Record<string, string>;
  sections?: Record<string, string>;
}) {
  const { progress } = useProgress();
  const [topic, setTopic] = useState('');
  const [section, setSection] = useState('');
  const [kind, setKind] = useState<SourceKind | ''>('');
  const [level, setLevel] = useState<Difficulty | 0>(0);
  const [status, setStatus] = useState<StatusFilter>('all');
  const [limit, setLimit] = useState(PAGE);
  const today = toDateKey(new Date());

  useEffect(() => setLimit(PAGE), [topic, section, kind, level, status]);

  const usedTopics = useMemo(
    () => Object.entries(topics).filter(([id]) => rows.some((r) => r.topics.includes(id))),
    [rows, topics],
  );
  const usedSections = useMemo(
    () => Object.entries(sections).filter(([id]) => rows.some((r) => r.section === id)),
    [rows, sections],
  );
  const usedKinds = useMemo(() => [...new Set(rows.map((r) => r.source.kind))], [rows]);

  const visible = rows.filter((r) => {
    if (topic && !r.topics.includes(topic)) return false;
    if (section && r.section !== section) return false;
    if (kind && r.source.kind !== kind) return false;
    if (level && r.difficulty !== level) return false;
    const rec = progress.attempts[r.id];
    if (status === 'review' && !(rec?.review && rec.review.due <= today)) return false;
    if (status === 'unanswered' && rec) return false;
    if (status === 'incorrect' && (!rec || rec.last === 'correct')) return false;
    if (status === 'bookmarked' && !progress.bookmarks[r.id]) return false;
    return true;
  });
  const shown = visible.slice(0, limit);

  if (rows.length === 0) return <p className="meta">{t.list.empty}</p>;

  return (
    <div>
      <div className={s.filters}>
        <label className="field">
          <span>{t.question.topic}</span>
          <select className="select" value={topic} onChange={(e) => setTopic(e.target.value)}>
            <option value="">{t.list.all}</option>
            {usedTopics.map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </label>
        {usedSections.length > 1 && (
          <label className="field">
            <span>{t.list.section}</span>
            <select className="select" value={section} onChange={(e) => setSection(e.target.value)}>
              <option value="">{t.list.all}</option>
              {usedSections.map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </label>
        )}
        {usedKinds.length > 1 && (
          <label className="field">
            <span>{t.question.source}</span>
            <select
              className="select"
              value={kind}
              onChange={(e) => setKind(e.target.value as SourceKind | '')}
            >
              <option value="">{t.list.all}</option>
              {usedKinds.map((k) => (
                <option key={k} value={k}>
                  {SOURCE_KIND_LABEL[k]}
                </option>
              ))}
            </select>
          </label>
        )}
        <label className="field">
          <span>{t.question.difficulty}</span>
          <select
            className="select"
            value={level}
            onChange={(e) => setLevel(Number(e.target.value) as Difficulty | 0)}
          >
            <option value={0}>{t.list.all}</option>
            {([1, 2, 3] as Difficulty[]).map((d) => (
              <option key={d} value={d}>
                {DIFFICULTY_LABEL[d]}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>{t.list.status}</span>
          <select
            className="select"
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
          >
            {(Object.keys(t.drill.scopes) as StatusFilter[]).map((k) => (
              <option key={k} value={k}>
                {t.drill.scopes[k]}
              </option>
            ))}
          </select>
        </label>
        <p className={s.count}>{t.drill.matching(visible.length)}</p>
      </div>

      <table className={s.table}>
        <thead>
          <tr>
            <th scope="col">{t.list.columns.no}</th>
            <th scope="col">{t.list.columns.stem}</th>
            <th scope="col" className={s.hideSm}>
              {t.list.columns.source}
            </th>
            <th scope="col" className={s.hideSm}>
              {t.list.columns.level}
            </th>
            <th scope="col" className={s.status}>
              {t.list.columns.status}
            </th>
          </tr>
        </thead>
        <tbody>
          {shown.map((r) => (
            <tr key={r.id}>
              <td className={s.no}>
                <a className={s.stemLink} href={r.href}>
                  {t.question.number(r.order)}
                </a>
              </td>
              <td>
                <a className={s.stemLink} href={r.href}>
                  {r.excerpt}
                </a>
                <div className={s.tags} style={{ marginTop: 'var(--s-1)' }}>
                  {r.topics.map((id) => (
                    <span key={id} className="tag">
                      {topics[id] ?? id}
                    </span>
                  ))}
                </div>
              </td>
              <td className={`${s.hideSm} ${s.dim}`}>{r.source.label ?? SOURCE_KIND_LABEL[r.source.kind]}</td>
              <td className={`${s.hideSm} ${s.dim}`}>{DIFFICULTY_LABEL[r.difficulty]}</td>
              <td className={s.status}>
                <span className={s.mark}>
                  <StatusMark record={progress.attempts[r.id]} />
                  {progress.bookmarks[r.id] && (
                    <Bookmark size={13} className={s.dim} aria-label={t.question.bookmarked} />
                  )}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {visible.length > shown.length && (
        <div className={s.more}>
          <button type="button" className="btn btn--ghost" onClick={() => setLimit((n) => n + PAGE * 2)}>
            {t.list.more(visible.length - shown.length)}
          </button>
        </div>
      )}
    </div>
  );
}
