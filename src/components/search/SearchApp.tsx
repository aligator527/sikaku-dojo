import { useEffect, useRef, useState } from 'react';

import { t } from '../../i18n';
import { href } from '../../lib/paths';
import s from './Search.module.css';

/* Minimal typing for the Pagefind browser API (https://pagefind.app/docs/api/). */
interface PagefindResult {
  url: string;
  excerpt: string;
  meta: { title?: string };
  filters: Record<string, string[]>;
}
interface Pagefind {
  options(o: { baseUrl?: string; excerptLength?: number }): Promise<void>;
  filters(): Promise<Record<string, Record<string, number>>>;
  debouncedSearch(
    q: string,
    o?: { filters?: Record<string, string> },
    ms?: number,
  ): Promise<{ results: { data(): Promise<PagefindResult> }[] } | null>;
}

type Status = 'loading' | 'ready' | 'unavailable';

/** Site search powered by the Pagefind index generated after `astro build`. */
export default function SearchApp() {
  const pagefind = useRef<Pagefind | null>(null);
  const [status, setStatus] = useState<Status>('loading');
  const [query, setQuery] = useState(() => new URLSearchParams(window.location.search).get('q') ?? '');
  const [filterOptions, setFilterOptions] = useState<Record<string, string[]>>({});
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [results, setResults] = useState<PagefindResult[] | null>(null);

  useEffect(() => {
    const url = href('pagefind/pagefind.js');
    import(/* @vite-ignore */ url)
      .then(async (mod: Pagefind) => {
        await mod.options({ baseUrl: href(), excerptLength: 40 });
        pagefind.current = mod;
        const available = await mod.filters();
        setFilterOptions(
          Object.fromEntries(Object.entries(available).map(([k, v]) => [k, Object.keys(v).sort()])),
        );
        setStatus('ready');
      })
      .catch(() => setStatus('unavailable'));
  }, []);

  useEffect(() => {
    const pf = pagefind.current;
    if (status !== 'ready' || !pf) return;
    const q = query.trim();
    const url = new URL(window.location.href);
    if (q) url.searchParams.set('q', q);
    else url.searchParams.delete('q');
    window.history.replaceState(null, '', url);
    if (!q) {
      setResults(null);
      return;
    }
    let cancelled = false;
    const active = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
    pf.debouncedSearch(q, { filters: active }, 200).then(async (res) => {
      if (!res || cancelled) return;
      const data = await Promise.all(res.results.slice(0, 30).map((r) => r.data()));
      if (!cancelled) setResults(data);
    });
    return () => {
      cancelled = true;
    };
  }, [query, filters, status]);

  return (
    <div className={s.wrap}>
      <form className={s.form} role="search" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="site-search" className="visually-hidden">
          {t.search.title}
        </label>
        <input
          id="site-search"
          className="input"
          type="search"
          autoFocus
          placeholder={t.search.placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>

      {Object.keys(filterOptions).length > 0 && (
        <div className={s.filters}>
          {Object.entries(filterOptions).map(([name, values]) => (
            <label className="field" key={name}>
              <span>{name}</span>
              <select
                className="select"
                value={filters[name] ?? ''}
                onChange={(e) => setFilters((f) => ({ ...f, [name]: e.target.value }))}
              >
                <option value="">{t.list.all}</option>
                {values.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      )}

      {status === 'loading' && <p className="meta">{t.common.loading}</p>}
      {status === 'unavailable' && <p className="meta">{t.search.unavailable}</p>}
      {results && results.length === 0 && <p className="meta">{t.search.noResults(query)}</p>}
      {results && results.length > 0 && (
        <>
          <p className="meta">{t.search.results(results.length)}</p>
          <ul className={s.results}>
            {results.map((r) => (
              <li className={s.result} key={r.url}>
                <a href={r.url}>{r.meta.title ?? r.url}</a>
                <p className={s.tags}>
                  {Object.values(r.filters)
                    .flat()
                    .map((v) => (
                      <span className="tag" key={v}>
                        {v}
                      </span>
                    ))}
                </p>
                <p className={s.excerpt} dangerouslySetInnerHTML={{ __html: r.excerpt }} />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
