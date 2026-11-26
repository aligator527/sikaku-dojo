/** Save / update / remove one exam for offline use. */
import { CloudDownload, RefreshCw, Trash2, WifiOff } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { t } from '../../i18n';
import {
  fetchPack,
  formatBytes,
  isSupported,
  removePack,
  savePack,
  savedRecords,
  type OfflinePack,
  type SavedRecord,
} from '../../lib/offline';
import s from './Offline.module.css';

type State = { kind: 'idle' } | { kind: 'saving'; done: number; total: number } | { kind: 'error' };

const shortDate = (iso: string) => {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}`;
};

export default function OfflineButton({ examId, compact = false }: { examId: string; compact?: boolean }) {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [record, setRecord] = useState<SavedRecord | undefined>();
  const [pack, setPack] = useState<OfflinePack | null>(null);
  const [state, setState] = useState<State>({ kind: 'idle' });
  const abort = useRef<AbortController | null>(null);

  useEffect(() => {
    const ok = isSupported() && import.meta.env.PROD;
    setSupported(ok);
    if (!ok) return;
    setRecord(savedRecords()[examId]);
    fetchPack(examId)
      .then(setPack)
      .catch(() => setPack(null));
  }, [examId]);

  if (supported === null) return null;
  if (!supported)
    return compact ? null : (
      <p className={s.note}>{import.meta.env.DEV ? t.offline.devOnly : t.offline.unsupported}</p>
    );

  const save = async () => {
    abort.current = new AbortController();
    setState({ kind: 'saving', done: 0, total: pack?.urls.length ?? 0 });
    try {
      const p = pack ?? (await fetchPack(examId));
      setPack(p);
      const r = await savePack(
        p,
        (done, total) => setState({ kind: 'saving', done, total }),
        abort.current.signal,
      );
      setRecord(r);
      setState({ kind: 'idle' });
    } catch (e) {
      setState(e instanceof DOMException && e.name === 'AbortError' ? { kind: 'idle' } : { kind: 'error' });
    }
  };

  const remove = async () => {
    await removePack(examId);
    setRecord(undefined);
  };

  if (state.kind === 'saving') {
    return (
      <div className={s.box} aria-live="polite">
        <p className={s.status}>{t.offline.saving(state.done, state.total)}</p>
        <span className={s.track}>
          <span
            className={s.fill}
            style={{ width: `${state.total ? (state.done / state.total) * 100 : 0}%` }}
          />
        </span>
        <button type="button" className="btn btn--quiet btn--sm" onClick={() => abort.current?.abort()}>
          {t.offline.cancel}
        </button>
      </div>
    );
  }

  const stale = record && pack && record.version !== pack.version;
  return (
    <div className={s.box}>
      {record ? (
        <>
          <p className={s.status}>
            <WifiOff size={14} aria-hidden="true" />
            {t.offline.saved(shortDate(record.savedAt), record.count)}・{formatBytes(record.bytes)}
          </p>
          {stale && <p className={s.note}>{t.offline.updateAvailable}</p>}
          <div className={s.actions}>
            <button type="button" className="btn btn--ghost btn--sm" onClick={save}>
              <RefreshCw size={14} aria-hidden="true" /> {t.offline.update}
            </button>
            <button type="button" className="btn btn--quiet btn--sm" onClick={remove}>
              <Trash2 size={14} aria-hidden="true" /> {t.offline.remove}
            </button>
          </div>
        </>
      ) : (
        <button type="button" className="btn btn--ghost btn--sm" onClick={save}>
          <CloudDownload size={15} aria-hidden="true" />
          {pack ? t.offline.save(formatBytes(pack.bytes)) : t.offline.saveShort}
        </button>
      )}
      {state.kind === 'error' && <p className={s.error}>{t.offline.failed}</p>}
    </div>
  );
}
