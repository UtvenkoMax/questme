import { Feather } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PageHeader, ProgressBar, SectionHeader } from '@/components/ui/layout';
import { Screen } from '@/components/ui/screen';
import { LoadingState } from '@/components/ui/status';
import { getAchievements, type AchievementWithState } from '@/services/achievement-service';
import { getQuestProgress, getQuests, type Quest } from '@/services/quest-service';
import { colors, radii, spacing, typography } from '@/theme';

export default function AchievementsScreen() {
  const router = useRouter();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      async function loadAchievements() {
        const storedQuests = await getQuests();
        if (!isMounted) return;
        setQuests(storedQuests);
        setIsLoading(false);
      }

      loadAchievements();
      return () => {
        isMounted = false;
      };
    }, [])
  );

  const achievements = useMemo(() => getAchievements(quests), [quests]);
  const progress = useMemo(() => getQuestProgress(quests), [quests]);
  const unlockedCount = achievements.filter((achievement) => achievement.unlocked).length;

  if (isLoading) {
    return (
      <Screen scroll={false}>
        <LoadingState text="Завантажуємо досягнення..." />
      </Screen>
    );
  }

  return (
    <Screen contentStyle={styles.content}>
      <Button fullWidth={false} icon="arrow-left" onPress={() => router.back()} size="sm" title="Назад" variant="ghost" />
      <PageHeader
        eyebrow="Achievements"
        subtitle="Бейджі відкриваються за активність, XP і командні маршрути."
        title="Досягнення"
      />

      <Card style={styles.summary}>
        <SectionHeader
          subtitle={`${unlockedCount}/${achievements.length} бейджів відкрито`}
          title={`Level ${progress.level}`}
        />
        <ProgressBar percent={(unlockedCount / achievements.length) * 100} />
      </Card>

      <View style={styles.grid}>
        {achievements.map((achievement) => (
          <AchievementCard achievement={achievement} key={achievement.id} />
        ))}
      </View>
    </Screen>
  );
}

function AchievementCard({ achievement }: { achievement: AchievementWithState }) {
  return (
    <Card style={[styles.card, !achievement.unlocked && styles.cardLocked]}>
      <View style={[styles.icon, achievement.unlocked && styles.iconUnlocked]}>
        <Feather color={achievement.unlocked ? colors.white : colors.inkSubtle} name={achievement.icon} size={22} />
      </View>
      <View style={styles.cardCopy}>
        <Text style={styles.title}>{achievement.title}</Text>
        <Text style={styles.text}>{achievement.description}</Text>
      </View>
      <View style={[styles.statePill, achievement.unlocked ? styles.stateOpen : styles.stateLocked]}>
        <Text style={styles.stateText}>{achievement.unlocked ? 'Відкрито' : 'Locked'}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  cardCopy: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  cardLocked: {
    opacity: 0.58,
  },
  content: {
    gap: spacing.xl,
  },
  grid: {
    gap: spacing.md,
  },
  icon: {
    alignItems: 'center',
    backgroundColor: colors.surfacePearl,
    borderRadius: radii.pill,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  iconUnlocked: {
    backgroundColor: colors.primary,
  },
  stateLocked: {
    backgroundColor: colors.surfacePearl,
  },
  stateOpen: {
    backgroundColor: colors.successSoft,
  },
  statePill: {
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  stateText: {
    ...typography.captionStrong,
    color: colors.inkMuted,
  },
  summary: {
    gap: spacing.md,
  },
  text: {
    ...typography.caption,
    color: colors.inkMuted,
  },
  title: {
    ...typography.subtitle,
    color: colors.ink,
    fontWeight: '700',
  },
});
