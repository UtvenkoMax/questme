import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { QuestCard } from '@/components/home/quest-card';
import { MOCK_QUESTS } from '@/components/home/quest.types';
import { homeStyles as s } from '@/components/home/home.styles';

const CHIPS = ['Всі', 'Поряд', 'Популярні', 'Нові', 'Природа', 'Місто'];

export default function HomeScreen() {
  const router = useRouter();
  const [activeChip, setActiveChip] = useState(0);
  const activeFilter = CHIPS[activeChip];
  const quests = useMemo(() => {
    if (activeFilter === 'Поряд') {
      return MOCK_QUESTS.filter((quest) => Number.parseFloat(quest.distance) <= 1.5);
    }

    if (activeFilter === 'Популярні') {
      return MOCK_QUESTS.filter((quest) => quest.rating >= 4.8 || quest.participants >= 1000);
    }

    if (activeFilter === 'Нові') {
      return [...MOCK_QUESTS].reverse();
    }

    if (activeFilter === 'Природа') {
      return MOCK_QUESTS.filter((quest) => quest.category === 'Природа');
    }

    if (activeFilter === 'Місто') {
      return MOCK_QUESTS.filter((quest) => quest.category !== 'Природа');
    }

    return MOCK_QUESTS;
  }, [activeFilter]);

  return (
    <SafeAreaView style={s.screen} edges={['top']}>
      <View style={s.header}>
        <View style={s.headerCopy}>
          <Text style={s.greeting}>Привіт, Мандрівнику</Text>
          <Text style={s.headerTitle}>Доступні квести</Text>
          <Text style={s.resultCount}>
            {quests.length} {quests.length === 1 ? 'маршрут' : 'маршрути'} у добірці
          </Text>
        </View>
      </View>

      <FlatList
        data={CHIPS}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.chipList}
        keyExtractor={(item) => item}
        renderItem={({ item, index }) => (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: index === activeChip }}
            hitSlop={6}
            onPress={() => setActiveChip(index)}
            style={[s.chip, index === activeChip && s.chipActive]}
          >
            <Text style={[s.chipText, index === activeChip && s.chipTextActive]}>{item}</Text>
          </Pressable>
        )}
      />

      <FlatList
        data={quests}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={s.emptyState}>
            <Text style={s.emptyTitle}>Квестів не знайдено</Text>
            <Text style={s.emptyText}>Спробуйте іншу категорію або поверніться до всіх маршрутів.</Text>
          </View>
        }
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <QuestCard
            quest={item}
            onPress={() => router.push(`/quest/${item.id}` as any)}
          />
        )}
      />
    </SafeAreaView>
  );
}
