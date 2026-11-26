import { useStore } from '@nanostores/react';
import { useEffect, useState } from 'react';

import { emptyProgress, type ProgressState } from '../../domain/progress';
import { $progress, $progressReady, initProgress } from '../../stores/progress';

const EMPTY = emptyProgress();

/**
 * Progress for React islands. Until mounted it returns an empty state, so server HTML
 * and the first client render always match (no hydration mismatch), then it switches
 * to what is stored in the browser.
 */
export function useProgress(): { progress: ProgressState; ready: boolean } {
  const state = useStore($progress);
  const loaded = useStore($progressReady);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    initProgress();
    setMounted(true);
  }, []);

  const ready = mounted && loaded;
  return { progress: ready ? state : EMPTY, ready };
}
