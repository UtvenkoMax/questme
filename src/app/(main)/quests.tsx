import * as Haptics from 'expo-haptics';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';

import { MOCK_QUESTS } from '@/components/home/quest.types';
import { PersonalQuestCard } from '@/components/home/personal-quest-card';
import { QuestHero } from '@/components/home/quest-hero';
import { ExploreSection } from '@/components/home/explore-section';
import { Button, IconButton } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ConfettiBurst } from '@/components/ui/confetti';
import { PageHeader, SectionHeader } from '@/components/ui/layout';
import { ProgressRing } from '@/components/ui/progress-ring';
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
import { getResponsiveMetrics } from '@/utils/responsive';
import { styles } from './quests.styles';

type Message = {
  text: string;
  tone: 'danger' | 'success' | 'neutral';
};

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
  const [showCelebration, setShowCelebration] = useState(false);

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
  const activeQuests = quests.filter((quest) => !quest.completed);
  const nextPersonalQuest = activeQuests[0];
  const nearestQuest = MOCK_QUESTS[0];
  const streakDays = progress.completedCount ? Math.min(progress.completedCount + 2, 14) : 0;

  const runQuickAction = (action: 'nearby' | 'continue' | 'publish') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});

    if (action === 'nearby') {
      router.push('/map');
      return;
    }

    if (action === 'publish') {
      router.push('/publish');
      return;
    }

    setMessage({
      text: nextPersonalQuest
        ? `Продовжуємо місію: ${nextPersonalQuest.title}.`
        : 'Активних персональних місій немає. Створіть нову або відкрийте квести поруч.',
      tone: 'neutral',
    });
  };

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
      
      if (quest?.completed) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 1600);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      
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
      <ConfettiBurst active={showCelebration} />
      <PageHeader
        action={
          <View style={styles.headerActions}>
            <IconButton accessibilityLabel="Повідомлення" icon="bell" onPress={() => router.push('/notifications' as never)} />
            <IconButton accessibilityLabel="Профіль" icon="user" onPress={() => router.push('/profile')} />
            <IconButton accessibilityLabel="Безпека" icon="shield" onPress={() => router.push('/security')} />
          </View>
        }
        eyebrow="QuestMe"
        subtitle="Твоя персональна мапа досягнень. Плануй, досліджуй, перемагай."
        title={profile ? `Привіт, ${profile.name} 👋` : 'Твої квести'}
      />

      <View style={[styles.dashboardGrid, layout.isWide && styles.dashboardGridWide]}>
        <Card style={styles.dashboardCard}>
          <View style={styles.dashboardTop}>
            <View style={styles.dashboardCopy}>
              <Text style={styles.dashboardEyebrow}>Сьогодні</Text>
              <Text style={styles.dashboardTitle}>План квестів</Text>
              <Text style={styles.dashboardText}>
                {nextPersonalQuest
                  ? `Наступна місія: ${nextPersonalQuest.title}`
                  : `Найближчий маршрут: ${nearestQuest.title}`}
              </Text>
            </View>
            <ProgressRing
              label="готово"
              percent={progress.completionPercent}
              size={104}
              value={`${progress.completionPercent}%`}
            />
          </View>
          <View style={styles.statGrid}>
            <DashboardStat label="Активні" value={activeQuests.length} />
            <DashboardStat label="XP" value={progress.totalPoints} />
            <DashboardStat label="Серія" value={`${streakDays} дн.`} />
            <DashboardStat label="Поруч" value={nearestQuest.distance} />
          </View>
        </Card>

        <Card style={styles.quickCard}>
          <SectionHeader
            subtitle="Найчастіші дії без зайвих переходів"
            title="Швидкий старт"
          />
          <View style={styles.quickActions}>
            <QuickAction icon="map-pin" label="Почати поруч" onPress={() => runQuickAction('nearby')} />
            <QuickAction icon="play" label="Продовжити" onPress={() => runQuickAction('continue')} />
            <QuickAction icon="send" label="Створити квест" onPress={() => runQuickAction('publish')} />
          </View>
        </Card>
      </View>

      <QuestHero progress={progress} />

      <View style={[styles.grid, layout.isWide && styles.gridWide]}>
        <View style={styles.personalList}>
          <SectionHeader
            subtitle="Ваші активні завдання на сьогодні"
            title="Поточні місії"
          />
          {quests.length ? (
            quests.map((quest) => (
              <PersonalQuestCard key={quest.id} onToggle={() => completeQuest(quest.id)} quest={quest} />
            ))
          ) : (
            <EmptyState
              action={<Button fullWidth={false} icon="plus" onPress={() => runQuickAction('publish')} title="Створити перший квест" />}
              icon="target"
              text="Поставте першу ціль, щоб почати накопичувати XP та досягнення."
              title="Місій немає"
            />
          )}
        </View>

        <Card style={styles.formCard}>
          <SectionHeader
            subtitle="Киньте собі новий виклик"
            title="Додати місію"
          />
          <TextField
            accessibilityLabel="Назва квесту"
            label="Назва"
            onChangeText={setTitle}
            placeholder="Наприклад: 10 000 кроків"
            returnKeyType="next"
            value={title}
          />
          <TextField
            accessibilityLabel="Опис квесту"
            label="Опис"
            multiline
            onChangeText={setDescription}
            placeholder="Короткі умови для зарахування"
            value={description}
          />
          {message ? <Notice tone={message.tone}>{message.text}</Notice> : null}
          <Button icon="plus" loading={isCreating} onPress={submitQuest} title="Створити" />
        </Card>
      </View>

      <ExploreSection isPhoneSize={isPhoneSize} layout={layout} />
    </Screen>
  );
}

type DashboardStatProps = {
  label: string;
  value: string | number;
};

function DashboardStat({ label, value }: DashboardStatProps) {
  return (
    <View style={styles.dashboardStat}>
      <Text numberOfLines={1} style={styles.dashboardStatValue}>{value}</Text>
      <Text numberOfLines={1} style={styles.dashboardStatLabel}>{label}</Text>
    </View>
  );
}

type QuickActionProps = {
  icon: React.ComponentProps<typeof IconButton>['icon'];
  label: string;
  onPress: () => void;
};

function QuickAction({ icon, label, onPress }: QuickActionProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.quickAction, pressed && styles.pressed]}>
      <IconButton accessibilityLabel={label} icon={icon} onPress={onPress} />
      <Text style={styles.quickActionText}>{label}</Text>
    </Pressable>
  );
}
