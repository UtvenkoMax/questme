import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DIFFICULTY_COLORS, MOCK_QUESTS } from '@/components/home/quest.types';
import { Button, IconButton } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Metric, Pill, SectionHeader } from '@/components/ui/layout';
import { EmptyState } from '@/components/ui/status';
import { colors } from '@/theme';
import { getResponsiveMetrics } from '@/utils/responsive';
import { styles } from './[id].styles';

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
              <Feather color={colors.primary} name="star" size={14} />
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
