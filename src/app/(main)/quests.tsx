import * as Haptics from 'expo-haptics';
import { Shuffle } from 'phosphor-react-native';
import { useMemo, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
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
import { useQuestFeed } from '@/hooks/useQuestFeed';

export default function FeedScreen() {
  const { quests, refresh, refreshing, selectedCategory, setSelectedCategory } = useQuestFeed();
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
            {message ? <Notice tone="success">{message}</Notice> : null}
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
        renderItem={({ index, item }) => <QuestCard index={index} quest={item} onTake={takeQuest} />}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
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
  screenContent: {
    flex: 1,
    paddingBottom: 0,
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
