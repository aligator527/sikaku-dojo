/**
 * "オフライン用に保存": downloads every page and question of one exam into Cache Storage,
 * where the service worker (src/integrations/sw-template.js) serves them when offline.
 * The list of URLs comes from /offline/<exam>.json, written at build time.
 */
import { href } from './paths';

export const SAVED_CACHE = 'sd-saved';
const KEY = 'sikaku-dojo:offline';

export interface OfflinePack {
  exam: string;
  version: string;
  bytes: number;
  urls: string[];
}

export interface SavedRecord {
  version: string;
  savedAt: string;
  count: number;
  bytes: number;
}

export function isSupported(): boolean {
  return typeof window !== 'undefined' && 'caches' in window && 'serviceWorker' in navigator;
}

export function savedRecords(): Record<string, SavedRecord> {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(KEY) ?? '{}');
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, SavedRecord>) : {};
  } catch {
    return {};
  }
}

function writeRecords(records: Record<string, SavedRecord>): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(records));
  } catch {
    /* storage full or disabled: the cache still works, only the summary is lost */
  }
}

export async function fetchPack(examId: string): Promise<OfflinePack> {
  const r = await fetch(href(`offline/${examId}.json`), { cache: 'no-store' });
  if (!r.ok) throw new Error(String(r.status));
  return (await r.json()) as OfflinePack;
}

/** Downloads a pack with a few parallel requests; reports progress as (done, total). */
export async function savePack(
  pack: OfflinePack,
  onProgress: (done: number, total: number) => void,
  signal?: AbortSignal,
): Promise<SavedRecord> {
  // Ask the browser not to evict the data under storage pressure (best effort).
  await navigator.storage?.persist?.().catch(() => false);
  const cache = await caches.open(SAVED_CACHE);
  let done = 0;
  const queue = [...pack.urls];
  const worker = async () => {
    while (queue.length > 0) {
      if (signal?.aborted) throw new DOMException('aborted', 'AbortError');
      const url = queue.shift()!;
      // The marker makes the service worker step aside, so the page is not cached twice.
      const response = await fetch(`${url}${url.includes('?') ? '&' : '?'}sd-save=1`, {
        cache: 'no-cache',
        signal,
      });
      if (response.ok) await cache.put(url, response);
      onProgress(++done, pack.urls.length);
    }
  };
  await Promise.all(Array.from({ length: 6 }, worker));
  const record = {
    version: pack.version,
    savedAt: new Date().toISOString(),
    count: pack.urls.length,
    bytes: pack.bytes,
  };
  writeRecords({ ...savedRecords(), [pack.exam]: record });
  return record;
}

/** Removes the exam's pages, keeping pages shared with another saved exam. */
export async function removePack(examId: string): Promise<void> {
  const cache = await caches.open(SAVED_CACHE);
  const records = savedRecords();
  delete records[examId];
  const others = await Promise.all(Object.keys(records).map((id) => fetchPack(id).catch(() => null)));
  const keep = new Set(others.flatMap((p) => p?.urls ?? []));
  const pack = await fetchPack(examId).catch(() => null);
  const urls =
    pack?.urls ??
    (await cache.keys()).map((r) => new URL(r.url).pathname).filter((p) => p.includes(`/${examId}/`));
  await Promise.all(urls.filter((u) => !keep.has(u)).map((u) => cache.delete(u)));
  writeRecords(records);
}

export const formatBytes = (n: number) =>
  n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`;
