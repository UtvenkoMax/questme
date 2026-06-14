import { Feather } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { QuestCard } from '@/components/home/quest-card';
import { MOCK_QUESTS } from '@/components/home/quest.types';
import { Button, IconButton } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Metric, PageHeader, Pill, ProgressBar, SectionHeader } from '@/components/ui/layout';
import { Screen } from '@/components/ui/screen';
import { EmptyState, LoadingState, Notice } from '@/components/ui/status';
import { TextField } from '@/components/ui/text-field';
import { getUserProfile, type UserProfile } from '@/services/auth-service';
import {
  createQuest,
  getQuestProgress,
  getQuests,
  toggleQuest,
  type Quest as PersonalQuest,
} from '@/services/quest-service';
import { colors, radii, spacing, typography } from '@/theme';
import { getResponsiveMetrics } from '@/utils/responsive';

type Message = {
  text: string;
  tone: 'danger' | 'success' | 'neutral';
};

const EXPLORE_FILTERS = ['Усі', 'Поряд', 'Популярні'] as const;

export default function QuestsScreen() {
  const router = useRouter();
  const { height, width } = useWindowDimensions();
  const layout = useMemo(() => getResponsiveMetrics(width, height), [height, width]);
  const isPhoneSize = !layout.isWide;
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [quests, setQuests] = useState<PersonalQuest[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [activeFilter, setActiveFilter] = useState<(typeof EXPLORE_FILTERS)[number]>('Усі');

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    const [storedProfile, storedQuests] = await Promise.all([getUserProfile(), getQuests()]);

    if (!storedProfile) {
      router.replace('/');
      return;
    }

    setProfile(storedProfile);
    setQuests(storedQuests);
    setIsLoading(false);
  }, [router]);

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [loadDashboard])
  );

  const progress = useMemo(() => getQuestProgress(quests), [quests]);
  const filteredRoutes = useMemo(() => {
    if (activeFilter === 'Поряд') {
      return MOCK_QUESTS.filter((quest) => Number.parseFloat(quest.distance) <= 1.5);
    }

    if (activeFilter === 'Популярні') {
      return MOCK_QUESTS.filter((quest) => quest.rating >= 4.8 || quest.participants > 1000);
    }

    return MOCK_QUESTS;
  }, [activeFilter]);

  const submitQuest = async () => {
    if (title.trim().length < 3) {
      setMessage({ text: 'Назва квесту має містити мінімум 3 символи.', tone: 'danger' });
      return;
    }

    setIsCreating(true);
    setMessage(null);

    try {
      const nextQuests = await createQuest(title, description);
      setQuests(nextQuests);
      setTitle('');
      setDescription('');
      setMessage({ text: 'Квест додано до вашого плану.', tone: 'success' });
    } catch {
      setMessage({ text: 'Не вдалося створити квест. Спробуйте ще раз.', tone: 'danger' });
    } finally {
      setIsCreating(false);
    }
  };

  const completeQuest = async (id: string) => {
    try {
      const nextQuests = await toggleQuest(id);
      const quest = nextQuests.find((item) => item.id === id);
      setQuests(nextQuests);
      setMessage({
        text: quest?.completed ? 'Квест виконано. Бали додано до прогресу.' : 'Квест повернуто в активні.',
        tone: 'success',
      });
    } catch {
      setMessage({ text: 'Не вдалося оновити прогрес.', tone: 'danger' });
    }
  };

  if (isLoading) {
    return (
      <Screen scroll={false}>
        <LoadingState text="Завантажуємо ваші квести..." />
      </Screen>
    );
  }

  return (
    <Screen contentStyle={styles.content} wide>
      <PageHeader
        action={
          <View style={styles.headerActions}>
            <IconButton accessibilityLabel="Профіль" icon="user" onPress={() => router.push('/profile')} />
            <IconButton accessibilityLabel="Безпека" icon="shield" onPress={() => router.push('/security')} />
          </View>
        }
        eyebrow="QuestMe"
        subtitle="Плануйте власні квести, проходьте міські маршрути й бачте прогрес без зайвої метушні."
        title={profile ? `Привіт, ${profile.name}` : 'Ваші квести'}
      />

      <Card style={styles.heroCard}>
        <View style={styles.heroCopy}>
          <Pill tone="accent">Сьогодні</Pill>
          <Text style={styles.heroTitle}>{progress.completionPercent}% виконано</Text>
          <Text style={styles.heroText}>
            {progress.completedCount} з {progress.totalCount} персональних квестів закрито. Накопичено {progress.totalPoints} балів.
          </Text>
          <ProgressBar percent={progress.completionPercent} />
        </View>
        <View style={styles.metrics}>
          <Metric label="Виконано" value={`${progress.completedCount}/${progress.totalCount}`} />
          <Metric label="Балів" value={progress.totalPoints} />
          <Metric label="Маршрутів" value={MOCK_QUESTS.length} />
        </View>
      </Card>

      <View style={[styles.grid, layout.isWide && styles.gridWide]}>
        <Card style={styles.formCard}>
          <SectionHeader
            subtitle="Достатньо короткої назви й зрозумілого критерію виконання."
            title="Новий квест"
          />
          <TextField
            accessibilityLabel="Назва квесту"
            label="Назва"
            onChangeText={setTitle}
            placeholder="Наприклад: 20 хвилин читання"
            returnKeyType="next"
            value={title}
          />
          <TextField
            accessibilityLabel="Опис квесту"
            label="Опис"
            multiline
            onChangeText={setDescription}
            placeholder="Що саме треба зробити, щоб зарахувати прогрес?"
            value={description}
          />
          {message ? <Notice tone={message.tone}>{message.text}</Notice> : null}
          <Button icon="plus" loading={isCreating} onPress={submitQuest} title="Додати квест" />
        </Card>

        <View style={styles.personalList}>
          <SectionHeader
            subtitle="Активні й завершені завдання зберігаються локально на пристрої."
            title="Мій план"
          />
          {quests.length ? (
            quests.map((quest) => (
              <PersonalQuestCard key={quest.id} onToggle={() => completeQuest(quest.id)} quest={quest} />
            ))
          ) : (
            <EmptyState
              icon="check-square"
              text="Створіть перший квест або додайте маршрут із добірки нижче."
              title="План поки порожній"
            />
          )}
        </View>
      </View>

      <View style={[styles.exploreSection, isPhoneSize && styles.exploreSectionPhone]}>
        <SectionHeader
          action={
            <Button
              fullWidth={false}
              icon="map"
              onPress={() => router.push('/map')}
              size="sm"
              title="Карта"
              variant="ghost"
            />
          }
          subtitle="Готові маршрути для прогулянок містом."
          title="Дослідити поруч"
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
    </Screen>
  );
}

type PersonalQuestCardProps = {
  onToggle: () => void;
  quest: PersonalQuest;
};

function PersonalQuestCard({ onToggle, quest }: PersonalQuestCardProps) {
  return (
    <Card style={[styles.personalCard, quest.completed && styles.personalCardDone]}>
      <View style={styles.personalHeader}>
        <View style={styles.personalTitleWrap}>
          <View style={[styles.checkIcon, quest.completed && styles.checkIconDone]}>
            <Feather color={quest.completed ? colors.white : colors.primary} name="check" size={16} />
          </View>
          <View style={styles.personalCopy}>
            <Text style={[styles.personalTitle, quest.completed && styles.personalTitleDone]}>{quest.title}</Text>
            <Text style={styles.personalDescription}>{quest.description}</Text>
          </View>
        </View>
        <Pill tone={quest.completed ? 'success' : 'primary'}>+{quest.points}</Pill>
      </View>
      <Button
        icon={quest.completed ? 'rotate-ccw' : 'check'}
        onPress={onToggle}
        size="md"
        title={quest.completed ? 'Повернути в активні' : 'Позначити виконаним'}
        variant={quest.completed ? 'ghost' : 'secondary'}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xxl,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  heroCard: {
    gap: spacing.xl,
  },
  heroCopy: {
    gap: spacing.md,
  },
  heroTitle: {
    color: colors.ink,
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 44,
  },
  heroText: {
    ...typography.subtitle,
    color: colors.inkMuted,
  },
  metrics: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  grid: {
    gap: spacing.xxl,
  },
  gridWide: {
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  formCard: {
    flex: 0.95,
    gap: spacing.lg,
  },
  personalList: {
    flex: 1.05,
    gap: spacing.md,
    minWidth: 0,
  },
  personalCard: {
    gap: spacing.lg,
  },
  personalCardDone: {
    backgroundColor: colors.successSoft,
    borderColor: '#B7DDCA',
  },
  personalHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  personalTitleWrap: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.md,
    minWidth: 0,
  },
  checkIcon: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radii.pill,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  checkIconDone: {
    backgroundColor: colors.success,
  },
  personalCopy: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  personalTitle: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: '900',
    lineHeight: 22,
  },
  personalTitleDone: {
    color: colors.success,
  },
  personalDescription: {
    ...typography.body,
    color: colors.inkMuted,
  },

  
  exploreSection: {
    gap: spacing.lg,
  },
  exploreSectionPhone: {
    paddingTop: '35%',
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  filterChip: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    color: colors.inkMuted,
    fontSize: 13,
    fontWeight: '900',
  },
  filterTextActive: {
    color: colors.white,
  },
  pressed: {
    opacity: 0.78,
  },
  routeGrid: {
    gap: spacing.lg,
  },
  routeGridWide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  routeItem: {
    width: '100%',
  },
  routeItemWide: {
    flexBasis: '48%',
    flexGrow: 1,
  },
});
