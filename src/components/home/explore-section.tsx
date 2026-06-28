import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { QuestCard } from '@/components/home/quest-card';
import { MOCK_QUESTS } from '@/components/home/quest.types';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/ui/layout';
import { EmptyState } from '@/components/ui/status';
import { TextField } from '@/components/ui/text-field';
import { styles } from '@/styles/quests.styles';
import type { ResponsiveMetrics } from '@/utils/responsive';

const EXPLORE_FILTERS = ['Усі', 'Поруч', 'Легкі', 'До 1 год', 'Для команди', 'Нові'] as const;
const SORT_OPTIONS = ['Відстань', 'Рейтинг', 'Тривалість'] as const;
const SUGGESTIONS = ['Поділ', 'парк', 'кава'] as const;

type ExploreSectionProps = {
  isPhoneSize: boolean;
  layout: ResponsiveMetrics;
};

export function ExploreSection({ isPhoneSize, layout }: ExploreSectionProps) {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<(typeof EXPLORE_FILTERS)[number]>('Усі');
  const [sortBy, setSortBy] = useState<(typeof SORT_OPTIONS)[number]>('Відстань');
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(['парк', 'Поділ']);

  const filteredRoutes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    let routes = MOCK_QUESTS.filter((quest) => {
      if (!normalizedQuery) return true;
      return `${quest.title} ${quest.location} ${quest.category}`.toLowerCase().includes(normalizedQuery);
    });

    if (activeFilter === 'Поруч') {
      routes = routes.filter((quest) => Number.parseFloat(quest.distance) <= 1.5);
    } else if (activeFilter === 'Легкі') {
      routes = routes.filter((quest) => quest.difficulty === 'Легко');
    } else if (activeFilter === 'До 1 год') {
      routes = routes.filter((quest) => quest.duration.includes('1'));
    } else if (activeFilter === 'Для команди') {
      routes = routes.filter((quest) => quest.isTeamQuest);
    } else if (activeFilter === 'Нові') {
      routes = routes.filter((quest) => quest.isNew);
    }

    return [...routes].sort((left, right) => {
      if (sortBy === 'Рейтинг') return right.rating - left.rating;
      if (sortBy === 'Тривалість') return Number.parseFloat(left.duration) - Number.parseFloat(right.duration);
      return Number.parseFloat(left.distance) - Number.parseFloat(right.distance);
    });
  }, [activeFilter, query, sortBy]);

  const selectSearchChip = (value: string) => {
    setQuery(value);
    setRecentSearches((current) => [value, ...current.filter((item) => item !== value)].slice(0, 4));
    Haptics.selectionAsync().catch(() => {});
  };

  const selectFilter = (filter: (typeof EXPLORE_FILTERS)[number]) => {
    setActiveFilter(filter);
    Haptics.selectionAsync().catch(() => {});
  };

  const selectSort = (sort: (typeof SORT_OPTIONS)[number]) => {
    setSortBy(sort);
    Haptics.selectionAsync().catch(() => {});
  };

  const submitSearch = () => {
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      setRecentSearches((current) => [trimmedQuery, ...current.filter((item) => item !== trimmedQuery)].slice(0, 4));
    }
  };

  return (
    <View style={[styles.exploreSection, isPhoneSize && styles.exploreSectionPhone]}>
      <SectionHeader
        action={
          <Button
            fullWidth={false}
            icon="map"
            onPress={() => router.push('/map')}
            size="sm"
            title="Відкрити карту"
            variant="secondary"
          />
        }
        subtitle="Міські пригоди навколо вас"
        title="Дослідити світ"
      />
      <View style={styles.searchPanel}>
        <TextField
          label="Пошук"
          onChangeText={setQuery}
          onSubmitEditing={submitSearch}
          placeholder="Назва, район або категорія"
          returnKeyType="search"
          value={query}
        />
        <View style={styles.searchChips}>
          {[...recentSearches, ...SUGGESTIONS].slice(0, 6).map((chip) => (
            <Pressable
              accessibilityRole="button"
              key={chip}
              onPress={() => selectSearchChip(chip)}
              style={({ pressed }) => [styles.suggestionChip, pressed && styles.pressed]}>
              <Text style={styles.suggestionText}>{chip}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View style={styles.filterRow}>
        {EXPLORE_FILTERS.map((filter) => (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: activeFilter === filter }}
            key={filter}
            onPress={() => selectFilter(filter)}
            style={({ pressed }) => [
              styles.filterChip,
              activeFilter === filter && styles.filterChipActive,
              pressed && styles.pressed,
            ]}>
            <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>{filter}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>Сортувати:</Text>
        {SORT_OPTIONS.map((sort) => (
          <Pressable
            accessibilityRole="button"
            key={sort}
            onPress={() => selectSort(sort)}
            style={({ pressed }) => [styles.sortChip, sortBy === sort && styles.sortChipActive, pressed && styles.pressed]}>
            <Text style={[styles.sortText, sortBy === sort && styles.sortTextActive]}>{sort}</Text>
          </Pressable>
        ))}
      </View>
      <View style={[styles.routeGrid, layout.listColumns > 1 && styles.routeGridWide]}>
        {filteredRoutes.length ? (
          filteredRoutes.map((quest) => (
            <View key={quest.id} style={[styles.routeItem, layout.listColumns > 1 && styles.routeItemWide]}>
              <QuestCard
                compact={layout.isCompactWidth}
                onPress={() => router.push(`/quest/${quest.id}`)}
                quest={quest}
              />
            </View>
          ))
        ) : (
          <EmptyState
            action={<Button fullWidth={false} icon="map-pin" onPress={() => router.push('/map')} title="Знайти поруч" />}
            icon="search"
            text="Спробуйте інший запит або відкрийте карту з найближчими маршрутами."
            title="Нічого не знайдено"
          />
        )}
      </View>
    </View>
  );
}
