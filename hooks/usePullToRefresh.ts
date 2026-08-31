import { useCallback, useState } from 'react';

/** Keeps the refresh spinner visible for at least this long, so a pull always feels responsive
 *  even when `onRefresh` resolves instantly (e.g. screens backed by a live Firestore listener). */
const MIN_VISIBLE_MS = 500;

export function usePullToRefresh(onRefresh?: () => Promise<unknown> | unknown) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    const startedAt = Date.now();
    try {
      await onRefresh?.();
    } finally {
      const elapsed = Date.now() - startedAt;
      if (elapsed < MIN_VISIBLE_MS) {
        await new Promise((resolve) => setTimeout(resolve, MIN_VISIBLE_MS - elapsed));
      }
      setRefreshing(false);
    }
  }, [onRefresh]);

  return { refreshing, handleRefresh };
}
