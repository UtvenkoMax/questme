import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getUserProfile, type UserProfile } from '@/services/auth-service';
import { createQuest, getQuestProgress, getQuests, toggleQuest, type Quest } from '@/services/quest-service';
import { getResponsiveMetrics } from '@/utils/responsive';

export default function HomeScreen() {
  const router = useRouter();
  const { height, width } = useWindowDimensions();
  const layout = useMemo(() => getResponsiveMetrics(width, height), [height, width]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadHome = useCallback(async () => {
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
      loadHome();
    }, [loadHome])
  );

  const progress = getQuestProgress(quests);
  const compact = layout.isCompactHeight || layout.isCompactWidth;

  const submitQuest = async () => {
    if (title.trim().length < 3) {
      setMessage('Назва квесту має містити мінімум 3 символи.');
      return;
    }

    setMessage('Створюємо квест...');
    const nextQuests = await createQuest(title, description);
    setQuests(nextQuests);
    setTitle('');
    setDescription('');
    setMessage('Квест додано.');
  };

  const completeQuest = async (id: string) => {
    const nextQuests = await toggleQuest(id);
    setQuests(nextQuests);
    setMessage('Прогрес оновлено.');
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingHorizontal: layout.gutter },
          layout.isWide && styles.contentWide,
          compact && styles.contentCompact,
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <View>
            <Text style={styles.eyebrow}>QuestMe</Text>
            <Text style={styles.title}>{profile ? `Привіт, ${profile.name}` : 'Головна'}</Text>
          </View>
          <View style={styles.topActions}>
            <Pressable
              accessibilityLabel="Профіль"
              accessibilityRole="button"
              onPress={() => router.push('/profile')}
              style={({ pressed }) => [styles.iconButton, pressed && styles.buttonPressed]}>
              <Text style={styles.iconButtonText}>П</Text>
            </Pressable>
            <Pressable
              accessibilityLabel="Налаштування безпеки"
              accessibilityRole="button"
              onPress={() => router.push('/security')}
              style={({ pressed }) => [styles.iconButton, pressed && styles.buttonPressed]}>
              <Text style={styles.iconButtonText}>S</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.progressPanel}>
          <View>
            <Text style={styles.progressValue}>{progress.completionPercent}%</Text>
            <Text style={styles.progressLabel}>
              {progress.completedCount} з {progress.totalCount} квестів виконано
            </Text>
          </View>
          <View style={styles.reward}>
            <Text style={styles.rewardValue}>{progress.totalPoints}</Text>
            <Text style={styles.rewardLabel}>балів</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress.completionPercent}%` }]} />
          </View>
        </View>

        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Новий квест</Text>
          <TextInput
            accessibilityLabel="Назва квесту"
            onChangeText={setTitle}
            placeholder="Наприклад: 20 хвилин читання"
            placeholderTextColor="#858C99"
            style={styles.input}
            value={title}
          />
          <TextInput
            accessibilityLabel="Опис квесту"
            multiline
            onChangeText={setDescription}
            placeholder="Опис або критерій виконання"
            placeholderTextColor="#858C99"
            style={[styles.input, styles.textArea]}
            value={description}
          />
          {message ? (
            <Text accessibilityLiveRegion="polite" style={styles.message}>
              {message}
            </Text>
          ) : null}
          <Pressable
            accessibilityRole="button"
            disabled={isLoading}
            onPress={submitQuest}
            style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}>
            <Text style={styles.primaryButtonText}>Додати квест</Text>
          </Pressable>
        </View>

        <View style={styles.questList}>
          <Text style={styles.sectionTitle}>Квести</Text>
          {quests.map((quest) => (
            <View key={quest.id} style={[styles.questCard, quest.completed && styles.questCardDone]}>
              <View style={styles.questHeader}>
                <Text style={styles.questTitle}>{quest.title}</Text>
                <Text style={styles.questPoints}>+{quest.points}</Text>
              </View>
              <Text style={styles.questDescription}>{quest.description}</Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => completeQuest(quest.id)}
                style={({ pressed }) => [
                  styles.questButton,
                  quest.completed && styles.questButtonDone,
                  pressed && styles.buttonPressed,
                ]}>
                <Text style={[styles.questButtonText, quest.completed && styles.questButtonTextDone]}>
                  {quest.completed ? 'Виконано' : 'Позначити виконаним'}
                </Text>
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F4F0EA',
  },
  content: {
    gap: 24,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  contentWide: {
    alignSelf: 'center',
    maxWidth: 720,
    width: '100%',
  },
  contentCompact: {
    gap: 18,
    paddingVertical: 18,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  topActions: {
    flexDirection: 'row',
    gap: 10,
  },
  eyebrow: {
    color: '#2D6A5F',
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  title: {
    color: '#171B22',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#D6D0C8',
    borderRadius: 16,
    borderWidth: 1,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  iconButtonText: {
    color: '#2D6A5F',
    fontSize: 16,
    fontWeight: '900',
  },
  progressPanel: {
    backgroundColor: '#171B22',
    borderRadius: 20,
    gap: 18,
    padding: 20,
  },
  progressValue: {
    color: '#FFFFFF',
    fontSize: 44,
    fontWeight: '900',
  },
  progressLabel: {
    color: '#DDE4E1',
    fontSize: 15,
    lineHeight: 22,
  },
  reward: {
    alignItems: 'baseline',
    flexDirection: 'row',
    gap: 8,
  },
  rewardValue: {
    color: '#F7C948',
    fontSize: 28,
    fontWeight: '900',
  },
  rewardLabel: {
    color: '#DDE4E1',
    fontSize: 15,
    fontWeight: '700',
  },
  progressTrack: {
    backgroundColor: '#39424F',
    borderRadius: 999,
    height: 10,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: '#F7C948',
    borderRadius: 999,
    height: '100%',
  },
  form: {
    gap: 12,
  },
  sectionTitle: {
    color: '#171B22',
    fontSize: 20,
    fontWeight: '900',
  },
  input: {
    minHeight: 54,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D6D0C8',
    backgroundColor: '#FFFFFF',
    color: '#171B22',
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  textArea: {
    minHeight: 86,
    textAlignVertical: 'top',
  },
  message: {
    color: '#59616F',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#2D6A5F',
    borderRadius: 16,
    justifyContent: 'center',
    minHeight: 56,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  questList: {
    gap: 12,
    paddingBottom: 18,
  },
  questCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D6D0C8',
    borderRadius: 18,
    borderWidth: 1,
    gap: 12,
    padding: 16,
  },
  questCardDone: {
    backgroundColor: '#E8F2ED',
    borderColor: '#A8C7B7',
  },
  questHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  questTitle: {
    color: '#171B22',
    flex: 1,
    fontSize: 17,
    fontWeight: '900',
  },
  questPoints: {
    color: '#2D6A5F',
    fontSize: 15,
    fontWeight: '900',
  },
  questDescription: {
    color: '#59616F',
    fontSize: 14,
    lineHeight: 21,
  },
  questButton: {
    alignItems: 'center',
    borderColor: '#2D6A5F',
    borderRadius: 14,
    borderWidth: 1.5,
    justifyContent: 'center',
    minHeight: 46,
  },
  questButtonDone: {
    backgroundColor: '#2D6A5F',
  },
  questButtonText: {
    color: '#2D6A5F',
    fontSize: 14,
    fontWeight: '900',
  },
  questButtonTextDone: {
    color: '#FFFFFF',
  },
  buttonPressed: {
    opacity: 0.78,
  },
});
