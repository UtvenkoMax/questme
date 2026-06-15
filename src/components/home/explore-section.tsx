import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { QuestCard } from '@/components/home/quest-card';
import { MOCK_QUESTS } from '@/components/home/quest.types';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/ui/layout';
import { styles } from '@/app/(main)/quests.styles';
import type { ResponsiveMetrics } from '@/utils/responsive';

const EXPLORE_FILTERS = ['Усі', 'Поряд', 'Популярні'] as const;

type ExploreSectionProps = {
  isPhoneSize: boolean;
  layout: ResponsiveMetrics;
};

export function ExploreSection({ isPhoneSize, layout }: ExploreSectionProps) {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<(typeof EXPLORE_FILTERS)[number]>('Усі');

  const filteredRoutes = useMemo(() => {
    if (activeFilter === 'Поряд') {
      return MOCK_QUESTS.filter((quest) => Number.parseFloat(quest.distance) <= 1.5);
    }
    if (activeFilter === 'Популярні') {
      return MOCK_QUESTS.filter((quest) => quest.rating >= 4.8 || quest.participants > 1000);
    }
    return MOCK_QUESTS;
  }, [activeFilter]);

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
      <View style={styles.filterRow}>
        {EXPLORE_FILTERS.map((filter) => (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: activeFilter === filter }}
            key={filter}
            onPress={() => setActiveFilter(filter)}
            style={({ pressed }) => [
              styles.filterChip,
              activeFilter === filter && styles.filterChipActive,
              pressed && styles.pressed,
            ]}>
            <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>{filter}</Text>
          </Pressable>
        ))}
      </View>
      <View style={[styles.routeGrid, layout.listColumns > 1 && styles.routeGridWide]}>
        {filteredRoutes.map((quest) => (
          <View key={quest.id} style={[styles.routeItem, layout.listColumns > 1 && styles.routeItemWide]}>
            <QuestCard
              compact={layout.isCompactWidth}
              onPress={() => router.push(`/quest/${quest.id}`)}
              quest={quest}
            />
          </View>
        ))}
      </View>
    </View>
  );
}
