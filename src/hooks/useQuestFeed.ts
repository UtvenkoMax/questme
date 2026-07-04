import { useMemo, useState } from 'react';

import { categories, feedQuests } from '@/data/questme';
import { feedFilters, getQuestSocialSeed, type QuestFeedFilter } from '@/data/social-features';
import { useSocialStore } from '@/store/social-store';

type CategoryId = (typeof categories)[number]['id'];

export function useQuestFeed() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [selectedFilter, setSelectedFilter] = useState<QuestFeedFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const questSocial = useSocialStore((state) => state.questSocial);

  const quests = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return feedQuests.filter((quest) => {
      const social = getQuestSocialSeed(quest.id, quest.title);
      const runtime = questSocial[quest.id];
      const matchesCategory = selectedCategory === 'all' || quest.category === selectedCategory;
      const searchableText = [
        quest.title,
        quest.author,
        quest.categoryLabel,
        social.city,
        ...social.tags,
      ]
        .join(' ')
        .toLowerCase();
      const matchesSearch = !normalizedQuery || searchableText.includes(normalizedQuery);
      const matchesFilter =
        selectedFilter === 'all' ||
        (selectedFilter === 'nearby' && social.locationMode === 'nearby') ||
        (selectedFilter === 'online' && social.locationMode === 'online') ||
        (selectedFilter === 'highReward' && quest.reward >= 75) ||
        (selectedFilter === 'new' && social.isNew) ||
        (selectedFilter === 'saved' && Boolean(runtime?.saved));

      return matchesCategory && matchesSearch && matchesFilter;
    });
  }, [questSocial, searchQuery, selectedCategory, selectedFilter]);

  const refresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 520));
    setRefreshing(false);
  };

  return {
    categories,
    feedFilters,
    quests,
    refresh,
    refreshing,
    searchQuery,
    selectedCategory,
    selectedFilter,
    setSelectedCategory,
    setSearchQuery,
    setSelectedFilter,
  };
}
