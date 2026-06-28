import { useCallback, useEffect, useRef, useState } from 'react';

import { fetchQuestShortsPage, type YouTubeShort } from '@/services/youtube.service';

export function useShorts() {
  const [items, setItems] = useState<YouTubeShort[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const nextPageTokenRef = useRef<string | undefined>(undefined);
  const sourceRef = useRef<'youtube' | 'fallback'>('youtube');

  const loadFirstPage = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const page = await fetchQuestShortsPage();
      sourceRef.current = page.source;
      nextPageTokenRef.current = page.nextPageToken;
      setItems(page.items);
      setHasMore(Boolean(page.nextPageToken));
      setWarning(page.warning ?? '');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Не вдалося завантажити YouTube Shorts.');
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    setError('');

    try {
      const page = await fetchQuestShortsPage();
      sourceRef.current = page.source;
      nextPageTokenRef.current = page.nextPageToken;
      setItems(page.items);
      setHasMore(Boolean(page.nextPageToken));
      setWarning(page.warning ?? '');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Не вдалося оновити YouTube Shorts.');
    } finally {
      setRefreshing(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || sourceRef.current === 'fallback') return;

    setLoadingMore(true);
    setError('');

    try {
      const page = await fetchQuestShortsPage({ pageToken: nextPageTokenRef.current });
      nextPageTokenRef.current = page.nextPageToken;
      setItems((currentItems) => {
        const existingIds = new Set(currentItems.map((item) => item.id));
        const nextItems = page.items.filter((item) => !existingIds.has(item.id));
        return [...currentItems, ...nextItems];
      });
      setHasMore(Boolean(page.nextPageToken));
      setWarning(page.warning ?? '');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Не вдалося підвантажити наступні Shorts.');
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore]);

  useEffect(() => {
    loadFirstPage();
  }, [loadFirstPage]);

  return {
    error,
    hasMore,
    items,
    loadMore,
    loading,
    loadingMore,
    refresh,
    refreshing,
    warning,
  };
}
