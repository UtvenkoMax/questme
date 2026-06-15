import * as Haptics from 'expo-haptics';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { View, useWindowDimensions } from 'react-native';

import { PersonalQuestCard } from '@/components/home/personal-quest-card';
import { QuestHero } from '@/components/home/quest-hero';
import { ExploreSection } from '@/components/home/explore-section';
import { Button, IconButton } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PageHeader, SectionHeader } from '@/components/ui/layout';
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
      <PageHeader
        action={
          <View style={styles.headerActions}>
            <IconButton accessibilityLabel="Профіль" icon="user" onPress={() => router.push('/profile')} />
            <IconButton accessibilityLabel="Безпека" icon="shield" onPress={() => router.push('/security')} />
          </View>
        }
        eyebrow="QuestMe"
        subtitle="Твоя персональна мапа досягнень. Плануй, досліджуй, перемагай."
        title={profile ? `Привіт, ${profile.name} 👋` : 'Твої квести'}
      />

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
