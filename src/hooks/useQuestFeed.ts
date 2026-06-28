import { useMemo, useState } from 'react';

import { categories, feedQuests } from '@/data/questme';

type CategoryId = (typeof categories)[number]['id'];

export function useQuestFeed() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [refreshing, setRefreshing] = useState(false);

  const quests = useMemo(() => {
    if (selectedCategory === 'all') return feedQuests;
    return feedQuests.filter((quest) => quest.category === selectedCategory);
  }, [selectedCategory]);

  const refresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 520));
    setRefreshing(false);
  };

  return {
    categories,
    quests,
    refresh,
    refreshing,
    selectedCategory,
    setSelectedCategory,
  };
}
