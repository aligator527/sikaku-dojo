/**
 * Keyboard shortcuts for drills and mock exams.
 * Keys are ignored while the learner types in a field, while a modal dialog is open,
 * and when a modifier (Ctrl, ⌘, Alt) is held, so browser shortcuts keep working.
 */
import { useEffect, useRef } from 'react';

export type ShortcutMap = Record<string, (event: KeyboardEvent) => void>;

const TYPING = new Set(['INPUT', 'TEXTAREA', 'SELECT']);

function isTyping(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  if (!TYPING.has(target.tagName)) return false;
  // Radio buttons and checkboxes are not text entry: let digits and Enter through.
  return !(target instanceof HTMLInputElement && (target.type === 'radio' || target.type === 'checkbox'));
}

/** Map keys are KeyboardEvent.key values, lower-cased for letters: "1", "enter", "arrowright", "f". */
export function useShortcuts(map: ShortcutMap, enabled = true): void {
  const current = useRef(map);
  current.current = map;

  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.isComposing) return;
      if (isTyping(e.target) || document.querySelector('dialog[open]')) return;
      const handler = current.current[e.key.toLowerCase()];
      if (!handler) return;
      e.preventDefault();
      handler(e);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [enabled]);
}

/** "1"…"9" → handler(n). */
export function digitKeys(count: number, handler: (n: number) => void): ShortcutMap {
  return Object.fromEntries(
    Array.from({ length: Math.min(9, count) }, (_, i) => [String(i + 1), () => handler(i + 1)]),
  );
}
