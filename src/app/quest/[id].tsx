import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DIFFICULTY_COLORS, MOCK_QUESTS } from '@/components/home/quest.types';
import { Button, IconButton } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Metric, Pill, SectionHeader } from '@/components/ui/layout';
import { EmptyState } from '@/components/ui/status';
import { colors, radii, spacing, typography } from '@/theme';
import { getResponsiveMetrics } from '@/utils/responsive';

function getQuestId(id: string | string[] | undefined) {
  return Array.isArray(id) ? id[0] : id;
}

export default function QuestDetailsScreen() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const router = useRouter();
  const { height, width } = useWindowDimensions();
  const layout = useMemo(() => getResponsiveMetrics(width, height), [height, width]);
  const quest = MOCK_QUESTS.find((item) => item.id === getQuestId(id));
  const compact = layout.isCompactHeight || layout.isCompactWidth;

  if (!quest) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.notFound}>
          <EmptyState
            action={<Button fullWidth={false} icon="arrow-left" onPress={() => router.back()} title="Назад" />}
            icon="map"
            text="Поверніться до списку й оберіть доступний маршрут."
            title="Квест не знайдено"
          />
        </View>
      </SafeAreaView>
    );
  }

  const difficultyColor = DIFFICULTY_COLORS[quest.difficulty];

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingHorizontal: layout.gutter },
          layout.isWide && styles.contentWide,
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, compact && styles.heroCompact]}>
          <Image contentFit="cover" source={quest.image} style={styles.heroImage} />
          <View style={styles.heroShade} />
          <View style={styles.heroTop}>
            <IconButton accessibilityLabel="Повернутися назад" icon="arrow-left" onPress={() => router.back()} />
            <View style={[styles.ratingBadge, { backgroundColor: colors.surface }]}>
              <Feather color={colors.accent} name="star" size={14} />
              <Text style={styles.ratingText}>{quest.rating.toFixed(1)}</Text>
            </View>
          </View>
          <View style={styles.heroBottom}>
            <Pill tone="accent">{quest.category}</Pill>
            <View style={[styles.difficultyBadge, { backgroundColor: `${difficultyColor}18` }]}>
              <View style={[styles.difficultyDot, { backgroundColor: difficultyColor }]} />
              <Text style={[styles.difficultyText, { color: difficultyColor }]}>{quest.difficulty}</Text>
            </View>
          </View>
        </View>

        <View style={styles.header}>
          <Text style={[styles.title, compact && styles.titleCompact]}>{quest.title}</Text>
          <Text style={styles.subtitle}>{quest.description}</Text>
        </View>

        <View style={styles.metrics}>
          <Metric label="Тривалість" value={quest.duration} />
          <Metric label="Відстань" value={quest.distance} />
          <Metric label="Учасників" value={quest.participants.toLocaleString('uk-UA')} />
        </View>

        <Card style={styles.card}>
          <SectionHeader
            subtitle="Маршрут відкривається покроково: точки, підказки й короткі завдання."
            title="Що всередині"
          />
          <Text style={styles.bodyText}>
            Квест можна проходити самостійно або з друзями. На старті ви бачите першу точку, а наступні відкриваються після виконання завдань.
          </Text>
          <View style={styles.locationRow}>
            <Feather color={colors.primary} name="navigation" size={18} />
            <Text style={styles.locationText}>{quest.location}</Text>
          </View>
        </Card>

        <View style={styles.actions}>
          <Button icon="map" onPress={() => router.push('/map')} title="Показати на карті" />
          <Button icon="arrow-left" onPress={() => router.back()} title="Повернутися до списку" variant="ghost" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    alignSelf: 'center',
    gap: spacing.xxl,
    paddingBottom: spacing.xxxl,
    paddingTop: spacing.md,
    width: '100%',
  },
  contentWide: {
    maxWidth: 760,
  },
  hero: {
    borderRadius: radii.xl,
    height: 318,
    overflow: 'hidden',
  },
  heroCompact: {
    height: 244,
  },
  heroImage: {
    height: '100%',
    width: '100%',
  },
  heroShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(16, 24, 32, 0.18)',
  },
  heroTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: spacing.lg,
    position: 'absolute',
    right: spacing.lg,
    top: spacing.lg,
  },
  heroBottom: {
    alignItems: 'center',
    bottom: spacing.lg,
    flexDirection: 'row',
    gap: spacing.sm,
    left: spacing.lg,
    position: 'absolute',
    right: spacing.lg,
  },
  ratingBadge: {
    alignItems: 'center',
    borderRadius: radii.pill,
    flexDirection: 'row',
    gap: 4,
    minHeight: 36,
    paddingHorizontal: spacing.md,
  },
  ratingText: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '900',
  },
  difficultyBadge: {
    alignItems: 'center',
    borderRadius: radii.pill,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  difficultyDot: {
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '900',
  },
  header: {
    gap: spacing.sm,
  },
  title: {
    color: colors.ink,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 40,
  },
  titleCompact: {
    fontSize: 28,
    lineHeight: 34,
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.inkMuted,
  },
  metrics: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  card: {
    gap: spacing.lg,
  },
  bodyText: {
    ...typography.body,
    color: colors.inkMuted,
  },
  locationRow: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radii.md,
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
  },
  locationText: {
    color: colors.primary,
    flex: 1,
    fontSize: 14,
    fontWeight: '900',
  },
  actions: {
    gap: spacing.md,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xxl,
  },
});
