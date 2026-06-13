import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DIFFICULTY_COLORS, MOCK_QUESTS } from '@/components/home/quest.types';

const QUEST_DESCRIPTIONS: Record<string, string> = {
  '1': 'Маршрут історичними вулицями з короткими завданнями на уважність. Підійде для прогулянки після роботи або вихідного дня.',
  '2': 'Легка прогулянка парком із природними точками, фото-завданнями та простими підказками для всієї команди.',
  '3': 'Міський маршрут для тих, хто любить атмосферні місця, каву та невеликі загадки між локаціями.',
};

function getQuestId(id: string | string[] | undefined) {
  return Array.isArray(id) ? id[0] : id;
}

export default function QuestDetailsScreen() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const router = useRouter();
  const questId = getQuestId(id);
  const quest = MOCK_QUESTS.find((item) => item.id === questId);

  if (!quest) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundTitle}>Квест не знайдено</Text>
          <Text style={styles.notFoundText}>Поверніться до списку й оберіть доступний маршрут.</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.back()}
            style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}>
            <Text style={styles.primaryButtonText}>Назад до квестів</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const difficultyColor = DIFFICULTY_COLORS[quest.difficulty];

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Image source={quest.image} style={styles.heroImage} contentFit="cover" />
          <View style={styles.heroShade} />
          <Pressable
            accessibilityLabel="Повернутися назад"
            accessibilityRole="button"
            hitSlop={8}
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backButton, pressed && styles.buttonPressed]}>
            <Text style={styles.backButtonText}>Назад</Text>
          </Pressable>
          <View style={styles.heroBadges}>
            <View style={[styles.categoryBadge, { backgroundColor: quest.accentColor }]}>
              <Text numberOfLines={1} style={styles.categoryText}>{quest.category}</Text>
            </View>
            <View style={[styles.difficultyBadge, { borderColor: difficultyColor + '55' }]}>
              <View style={[styles.difficultyDot, { backgroundColor: difficultyColor }]} />
              <Text numberOfLines={1} style={[styles.difficultyText, { color: difficultyColor }]}>
                {quest.difficulty}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>{quest.title}</Text>
          <Text style={styles.subtitle}>{QUEST_DESCRIPTIONS[quest.id]}</Text>
        </View>

        <View style={styles.statsRow}>
          <Stat label="Тривалість" value={quest.duration} />
          <Stat label="Відстань" value={quest.distance} />
          <Stat label="Рейтинг" value={quest.rating.toFixed(1)} />
        </View>

        <View style={styles.infoBlock}>
          <Text style={styles.sectionTitle}>Що всередині</Text>
          <Text style={styles.bodyText}>
            Отримайте послідовність точок, короткі підказки й завдання, які відкриваються під час проходження маршруту.
            Квест можна проходити самостійно або з друзями.
          </Text>
          <View style={styles.participantsBadge}>
            <Text style={styles.participantsValue}>{quest.participants.toLocaleString('uk-UA')}</Text>
            <Text style={styles.participantsLabel}>учасників уже спробували</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/map' as any)}
            style={({ pressed }) => [
              styles.primaryButton,
              { backgroundColor: quest.accentColor },
              pressed && styles.buttonPressed,
            ]}>
            <Text style={styles.primaryButtonText}>Показати на карті</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.back()}
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}>
            <Text style={styles.secondaryButtonText}>Повернутися до списку</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type StatProps = {
  label: string;
  value: string;
};

function Stat({ label, value }: StatProps) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue} numberOfLines={1}>{value}</Text>
      <Text style={styles.statLabel} numberOfLines={1}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  content: {
    gap: 22,
    paddingBottom: 30,
  },
  hero: {
    height: 310,
    overflow: 'hidden',
  },
  heroImage: {
    height: '100%',
    width: '100%',
  },
  heroShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(17, 24, 39, 0.22)',
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: 14,
    justifyContent: 'center',
    left: 20,
    minHeight: 42,
    paddingHorizontal: 14,
    position: 'absolute',
    top: 16,
  },
  backButtonText: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '800',
  },
  heroBadges: {
    bottom: 18,
    flexDirection: 'row',
    gap: 10,
    left: 20,
    position: 'absolute',
    right: 20,
  },
  categoryBadge: {
    borderRadius: 14,
    maxWidth: '58%',
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
  },
  difficultyBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  difficultyDot: {
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  difficultyText: {
    fontSize: 13,
    fontWeight: '800',
  },
  header: {
    gap: 10,
    paddingHorizontal: 20,
  },
  title: {
    color: '#111827',
    fontSize: 32,
    fontWeight: '900',
    lineHeight: 38,
  },
  subtitle: {
    color: '#4B5563',
    fontSize: 16,
    lineHeight: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
  },
  stat: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
    gap: 4,
    minWidth: 0,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  statValue: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
  },
  statLabel: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  infoBlock: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 20,
    borderWidth: 1,
    gap: 12,
    marginHorizontal: 20,
    padding: 18,
  },
  sectionTitle: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '900',
  },
  bodyText: {
    color: '#4B5563',
    fontSize: 15,
    lineHeight: 23,
  },
  participantsBadge: {
    alignItems: 'baseline',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    paddingTop: 4,
  },
  participantsValue: {
    color: '#A855F7',
    fontSize: 22,
    fontWeight: '900',
  },
  participantsLabel: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '700',
  },
  actions: {
    gap: 12,
    paddingHorizontal: 20,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#A855F7',
    borderRadius: 16,
    justifyContent: 'center',
    minHeight: 56,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 52,
  },
  secondaryButtonText: {
    color: '#4B5563',
    fontSize: 15,
    fontWeight: '800',
  },
  buttonPressed: {
    opacity: 0.76,
  },
  notFound: {
    flex: 1,
    gap: 14,
    justifyContent: 'center',
    padding: 24,
  },
  notFoundTitle: {
    color: '#111827',
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
  },
  notFoundText: {
    color: '#6B7280',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
});
