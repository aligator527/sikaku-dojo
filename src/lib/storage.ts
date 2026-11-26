/**
 * Persistence port for learner progress. Today it is localStorage; a cloud adapter
 * (Supabase, Firebase …) can implement the same interface without touching the UI.
 */
export interface ProgressStorage {
  load(): unknown;
  save(value: unknown): void;
  /** Called when another tab changes the stored value. Returns an unsubscribe function. */
  subscribe(onChange: (value: unknown) => void): () => void;
}

const parse = (raw: string | null): unknown => {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export function localStorageAdapter(key: string): ProgressStorage {
  const available = (() => {
    try {
      return typeof window !== 'undefined' && !!window.localStorage;
    } catch {
      return false;
    }
  })();

  return {
    load: () => (available ? parse(window.localStorage.getItem(key)) : null),
    save: (value) => {
      if (!available) return;
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // Quota exceeded or storage disabled: progress stays in memory for this session.
      }
    },
    subscribe: (onChange) => {
      if (!available) return () => {};
      const handler = (e: StorageEvent) => {
        if (e.key === key) onChange(parse(e.newValue));
      };
      window.addEventListener('storage', handler);
      return () => window.removeEventListener('storage', handler);
    },
  };
}
