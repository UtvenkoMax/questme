import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/query-client';
import { getQuests, createQuest, toggleQuest, getQuestProgress, type Quest } from '@/services/quest-service';
import { useQuestStore } from '@/store/quest-store';

/**
 * Fetch all personal quests.
 * Syncs data into Zustand store after fetch for offline access.
 */
export function useQuests() {
  const syncFromStorage = useQuestStore((s) => s.syncFromStorage);

  return useQuery({
    queryKey: queryKeys.quests.list(),
    queryFn: async () => {
      const quests = await getQuests();
      syncFromStorage(quests);
      return quests;
    },
  });
}

/** Get quest progress stats (derived from cached quest data) */
export function useQuestProgress() {
  return useQuery({
    queryKey: queryKeys.quests.progress(),
    queryFn: async () => {
      const quests = await getQuests();
      return getQuestProgress(quests);
    },
  });
}

/** Create a new quest — optimistic update */
export function useCreateQuest() {
  const client = useQueryClient();
  const addQuest = useQuestStore((s) => s.addQuest);

  return useMutation({
    mutationFn: async ({ title, description }: { title: string; description: string }) => {
      return createQuest(title, description);
    },
    onMutate: async ({ title, description }) => {
      // Cancel outgoing refetches
      await client.cancelQueries({ queryKey: queryKeys.quests.list() });

      // Snapshot previous value
      const previous = client.getQueryData<Quest[]>(queryKeys.quests.list());

      // Optimistically add quest
      const optimistic: Quest = {
        id: `temp-${Date.now()}`,
        title,
        description: description || 'Короткий квест без опису.',
        points: 50,
        completed: false,
        createdAt: new Date().toISOString(),
      };

      client.setQueryData<Quest[]>(queryKeys.quests.list(), (old) =>
        old ? [optimistic, ...old] : [optimistic]
      );
      addQuest(optimistic);

      return { previous };
    },
    onError: (_err, _vars, context) => {
      // Rollback on error
      if (context?.previous) {
        client.setQueryData(queryKeys.quests.list(), context.previous);
      }
    },
    onSettled: () => {
      // Refetch after mutation
      client.invalidateQueries({ queryKey: queryKeys.quests.all });
    },
  });
}

/** Toggle quest completion — optimistic update */
export function useToggleQuest() {
  const client = useQueryClient();
  const storeToggle = useQuestStore((s) => s.toggleQuest);

  return useMutation({
    mutationFn: async (id: string) => {
      return toggleQuest(id);
    },
    onMutate: async (id) => {
      await client.cancelQueries({ queryKey: queryKeys.quests.list() });
      const previous = client.getQueryData<Quest[]>(queryKeys.quests.list());

      client.setQueryData<Quest[]>(queryKeys.quests.list(), (old) =>
        old?.map((q) =>
          q.id === id
            ? {
                ...q,
                completed: !q.completed,
                completedAt: !q.completed ? new Date().toISOString() : undefined,
              }
            : q
        )
      );
      storeToggle(id);

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        client.setQueryData(queryKeys.quests.list(), context.previous);
      }
    },
    onSettled: () => {
      client.invalidateQueries({ queryKey: queryKeys.quests.all });
    },
  });
}

/** Prefetch quests for instant navigation */
export function usePrefetchQuests() {
  const client = useQueryClient();

  return () => {
    client.prefetchQuery({
      queryKey: queryKeys.quests.list(),
      queryFn: getQuests,
    });
  };
}
