import { useMemo, useState } from 'react';

import { KANA_ROWS } from '../../domain/kana';
import { t } from '../../i18n';
import s from './Glossary.module.css';

export interface TermRow {
  id: string;
  term: string;
  reading: string;
  en?: string;
  aliases: string[];
  exams: string[];
  summary: string;
  row: string;
  href: string;
}

interface Props {
  terms: TermRow[];
  /** When given, shows an exam filter (global glossary). */
  exams?: { id: string; name: string }[];
}

const normalize = (s: string) => s.normalize('NFKC').toLowerCase();

/** 50音 index with instant filtering by term, reading, English name or alias. */
export default function GlossaryIndex({ terms, exams }: Props) {
  const [query, setQuery] = useState('');
  const [exam, setExam] = useState('');

  const visible = useMemo(() => {
    const q = normalize(query.trim());
    return terms.filter((term) => {
      if (exam && !term.exams.includes(exam)) return false;
      if (!q) return true;
      return [term.term, term.reading, term.en ?? '', ...term.aliases].some((v) => normalize(v).includes(q));
    });
  }, [terms, query, exam]);

  const rows = KANA_ROWS.map((row) => ({ row, items: visible.filter((x) => x.row === row) }));

  return (
    <div>
      <div className={s.toolbar}>
        <label className={`field ${s.search}`}>
          <span>{t.glossary.filter}</span>
          <input
            className="input"
            type="search"
            placeholder={t.glossary.filterPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        {exams && (
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
        )}
      </div>

      <nav className={s.kana} aria-label="50音索引">
        {rows.map(({ row, items }) =>
          items.length > 0 ? (
            <a key={row} href={`#kana-${row}`}>
              {row}
            </a>
          ) : (
            <span key={row} aria-hidden="true">
              {row}
            </span>
          ),
        )}
      </nav>

      {visible.length === 0 && <p className={s.empty}>{t.glossary.none}</p>}

      {rows
        .filter((r) => r.items.length > 0)
        .map(({ row, items }) => (
          <section className={s.row} key={row} id={`kana-${row}`}>
            <h2 className={s.rowTitle}>{row}行</h2>
            <ul className={s.list}>
              {items.map((term) => (
                <li className={s.item} key={term.id}>
                  <div className={s.term}>
                    <a href={term.href}>{term.term}</a>
                    <span className={s.reading}>{term.reading}</span>
                  </div>
                  <p className={s.summary}>
                    {term.summary}
                    {term.en && <span className={s.en}>{term.en}</span>}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ))}
    </div>
  );
}
