import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Shuffle } from 'phosphor-react-native';
import { useMemo, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { CategoryFilter } from '@/components/quest/CategoryFilter';
import { QuestCard } from '@/components/quest/QuestCard';
import { ChaosAvatar, ChaosBadge, ChaosButton, SectionKicker, StatPill } from '@/components/ui/chaos';
import { Notice } from '@/components/ui/status';
import { Screen } from '@/components/ui/screen';
import { getAvatarPhotoIdForAccount, getAvatarPhotoSource } from '@/constants/avatarPhotos';
import { questColors } from '@/constants/colors';
import { radii, spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { questOfDay, type FeedQuest } from '@/data/questme';
import type { QuestFeedFilter } from '@/data/social-features';
import { useQuestFeed } from '@/hooks/useQuestFeed';

export default function FeedScreen() {
  const router = useRouter();
  const {
    feedFilters,
    quests,
    refresh,
    refreshing,
    searchQuery,
    selectedCategory,
    selectedFilter,
    setSearchQuery,
    setSelectedCategory,
    setSelectedFilter,
  } = useQuestFeed();
  const [message, setMessage] = useState('');
  const spin = useRef(new Animated.Value(0)).current;

  const spinStyle = useMemo(
    () => ({
      transform: [
        {
          rotate: spin.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg'],
          }),
        },
      ],
    }),
    [spin]
  );

  const onRefresh = async () => {
    spin.setValue(0);
    Animated.loop(Animated.timing(spin, { duration: 680, toValue: 1, useNativeDriver: true })).start();
    await refresh();
    spin.stopAnimation();
  };

  const takeQuest = (quest: FeedQuest) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setMessage(`Квест взято: ${quest.title}`);
  };

  const runRoulette = () => {
    const randomQuest = quests[Math.floor(Math.random() * quests.length)];
    if (!randomQuest) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
    setMessage(`Рулетка вибрала: ${randomQuest.title}`);
  };

  const openQuest = (quest: FeedQuest) => {
    router.push({ pathname: '/quest/[id]', params: { id: quest.id } });
  };

  return (
    <Screen contentStyle={styles.screenContent} scroll={false} wide>
      <FlatList
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.heroTop}>
              <View>
                <Text style={styles.kicker}>QuestMe Feed</Text>
                <Text style={styles.title}>Квести, за які платять.</Text>
              </View>
              <Animated.View style={[styles.qmSpinner, refreshing && spinStyle]}>
                <Text style={styles.qmText}>QM</Text>
              </Animated.View>
            </View>

            <QuestOfDayBanner onTake={() => takeQuest(questOfDay)} />

            <View style={styles.statsRow}>
              <StatPill label="активні" value="14,892" />
              <StatPill label="сьогодні" value="+2,341 грн" />
              <StatPill label="серія" value="7 днів" />
            </View>

            <SectionKicker
              action={
                <ChaosButton
                  icon={<Shuffle color={questColors.void} size={18} weight="bold" />}
                  label="Рулетка"
                  onPress={runRoulette}
                  variant="ember"
                />
              }
              eyebrow="Категорії"
              title="Обери свій рівень хаосу"
            />
            <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
            <TextInput
              autoCapitalize="none"
              onChangeText={setSearchQuery}
              placeholder="Пошук за назвою, містом, категорією"
              placeholderTextColor={questColors.textSecondary}
              selectionColor={questColors.acid}
              style={styles.searchInput}
              value={searchQuery}
            />
            <FeedFilterRail
              filters={feedFilters}
              onSelect={setSelectedFilter}
              selected={selectedFilter}
            />
            {message ? <Notice tone="success">{message}</Notice> : null}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Немає квестів за цими фільтрами</Text>
            <Text style={styles.emptyText}>
              Змініть категорію, пошук або відкрийте збережені після свайпу чи кнопки bookmark.
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        data={quests}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            colors={[questColors.acid, questColors.electric]}
            onRefresh={onRefresh}
            progressBackgroundColor={questColors.surface}
            refreshing={refreshing}
            tintColor={questColors.acid}
          />
        }
        renderItem={({ index, item }) => (
          <QuestCard index={index} quest={item} onOpen={openQuest} onTake={takeQuest} />
        )}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}

function FeedFilterRail({
  filters,
  onSelect,
  selected,
}: {
  filters: { id: QuestFeedFilter; label: string }[];
  onSelect: (id: QuestFeedFilter) => void;
  selected: QuestFeedFilter;
}) {
  return (
    <View style={styles.filterRow}>
      {filters.map((filter) => {
        const active = filter.id === selected;

        return (
          <Pressable
            accessibilityRole="button"
            key={filter.id}
            onPress={() => onSelect(filter.id)}
            style={({ pressed }) => [styles.filterChip, active && styles.filterChipActive, pressed && styles.pressed]}>
            <Text style={[styles.filterText, active && styles.filterTextActive]}>{filter.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function QuestOfDayBanner({ onTake }: { onTake: () => void }) {
  return (
    <View style={styles.dayCard}>
      <View style={styles.dayHeader}>
        <ChaosAvatar
          label={questOfDay.avatar}
          size={40}
          source={getAvatarPhotoSource(getAvatarPhotoIdForAccount(`${questOfDay.id}:${questOfDay.author}`))}
        />
        <View style={styles.dayCopy}>
          <Text style={styles.dayEyebrow}>Рандомний квест дня</Text>
          <Text style={styles.dayTimer}>{questOfDay.deadline}</Text>
        </View>
        <ChaosBadge tone="acid">{questOfDay.reward} грн</ChaosBadge>
      </View>
      <Text style={styles.dayTitle}>{questOfDay.title}</Text>
      <ChaosButton label="Взяти квест дня" onPress={onTake} />
    </View>
  );
}

const styles = StyleSheet.create({
  dayCard: {
    backgroundColor: 'rgba(124, 58, 255, 0.16)',
    borderColor: 'rgba(196,255,0,0.28)',
    borderRadius: radii.md,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
  },
  dayCopy: {
    flex: 1,
    gap: spacing.xxs,
  },
  dayEyebrow: {
    ...typography.eyebrow,
    color: questColors.acid,
    textTransform: 'uppercase',
  },
  dayHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dayTimer: {
    ...typography.label,
    color: questColors.textPrimary,
  },
  dayTitle: {
    ...typography.titleCompact,
    color: questColors.textPrimary,
  },
  header: {
    gap: spacing.lg,
  },
  emptyCard: {
    backgroundColor: questColors.surface,
    borderColor: questColors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.lg,
  },
  emptyText: {
    ...typography.caption,
    color: questColors.textSecondary,
  },
  emptyTitle: {
    ...typography.subtitle,
    color: questColors.textPrimary,
  },
  filterChip: {
    backgroundColor: questColors.surface,
    borderColor: questColors.border,
    borderRadius: radii.xs,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  filterChipActive: {
    backgroundColor: 'rgba(196,255,0,0.14)',
    borderColor: 'rgba(196,255,0,0.44)',
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  filterText: {
    ...typography.label,
    color: questColors.textSecondary,
  },
  filterTextActive: {
    color: questColors.acid,
  },
  heroTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.lg,
    justifyContent: 'space-between',
  },
  kicker: {
    ...typography.eyebrow,
    color: questColors.acid,
    textTransform: 'uppercase',
  },
  listContent: {
    gap: spacing.lg,
    paddingBottom: 120,
  },
  qmSpinner: {
    alignItems: 'center',
    backgroundColor: questColors.surface,
    borderColor: questColors.border,
    borderRadius: radii.xs,
    borderWidth: 1,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  qmText: {
    ...typography.label,
    color: questColors.textPrimary,
  },
  pressed: {
    opacity: 0.72,
  },
  screenContent: {
    flex: 1,
    paddingBottom: 0,
  },
  searchInput: {
    ...typography.body,
    backgroundColor: questColors.surface,
    borderColor: questColors.border,
    borderRadius: radii.sm,
    borderWidth: 1,
    color: questColors.textPrimary,
    minHeight: 52,
    paddingHorizontal: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  title: {
    ...typography.title,
    color: questColors.textPrimary,
  },
});
