import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/query-client';
import { getAchievements, type AchievementWithState } from '@/services/achievement-service';
import { getQuests } from '@/services/quest-service';

/** Fetch achievements with unlocked state */
export function useAchievements() {
  return useQuery({
    queryKey: queryKeys.achievements.list(),
    queryFn: async () => {
      const quests = await getQuests();
      return getAchievements(quests);
    },
    staleTime: 60 * 1000,
  });
}

/** Get only unlocked achievements */
export function useUnlockedAchievements() {
  const { data: achievements, ...rest } = useAchievements();
  const unlocked = achievements?.filter((a) => a.unlocked) ?? [];

  return { data: unlocked, ...rest };
}

/** Count of newly unlocked achievements (for badge notification) */
export function useNewAchievementCount() {
  const { data: achievements } = useAchievements();
  return achievements?.filter((a) => a.unlocked).length ?? 0;
}
