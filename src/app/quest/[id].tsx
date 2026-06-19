import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DIFFICULTY_COLORS, MOCK_QUESTS } from '@/components/home/quest.types';
import { Button, IconButton } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Metric, Pill, ProgressBar, SectionHeader } from '@/components/ui/layout';
import { ProgressRing } from '@/components/ui/progress-ring';
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
  const [activeStep, setActiveStep] = useState(0);

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
  const stepPercent = Math.round(((activeStep + 1) / quest.steps.length) * 100);

  const startQuest = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    router.push('/map');
  };

  const nextStep = () => {
    Haptics.selectionAsync().catch(() => {});
    setActiveStep((currentStep) => Math.min(currentStep + 1, quest.steps.length - 1));
  };

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

        <Card style={styles.progressCard}>
          <ProgressRing label="етапи" percent={stepPercent} value={`${activeStep + 1}/${quest.steps.length}`} />
          <View style={styles.progressCopy}>
            <SectionHeader
              subtitle="Покроковий прогрес перед стартом маршруту"
              title="Прогрес квесту"
            />
            <ProgressBar percent={stepPercent} />
            <Text style={styles.bodyText}>{quest.steps[activeStep].description}</Text>
            <Button
              disabled={activeStep === quest.steps.length - 1}
              fullWidth={false}
              icon="arrow-right"
              onPress={nextStep}
              size="sm"
              title={activeStep === quest.steps.length - 1 ? 'Фінальний етап' : 'Наступний етап'}
              variant="secondary"
            />
          </View>
        </Card>

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

        <Card style={styles.card}>
          <SectionHeader
            subtitle="Що буде відкриватися під час маршруту"
            title="Timeline точок"
          />
          <View style={styles.timeline}>
            {quest.steps.map((step, index) => (
              <View key={step.title} style={styles.timelineItem}>
                <View style={[styles.timelineDot, index <= activeStep && styles.timelineDotActive]}>
                  <Text style={[styles.timelineDotText, index <= activeStep && styles.timelineDotTextActive]}>
                    {index + 1}
                  </Text>
                </View>
                <View style={styles.timelineCopy}>
                  <Text style={styles.timelineTitle}>{step.title}</Text>
                  <Text style={styles.timelineText}>{step.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </Card>

        <View style={[styles.infoGrid, layout.isWide && styles.infoGridWide]}>
          <Card style={styles.infoCard}>
            <SectionHeader title="Що взяти" />
            <View style={styles.gearList}>
              {quest.recommendedGear.map((item) => (
                <View key={item} style={styles.gearItem}>
                  <Feather color={colors.primary} name="check-circle" size={16} />
                  <Text style={styles.gearText}>{item}</Text>
                </View>
              ))}
            </View>
          </Card>

          <Card style={styles.infoCard}>
            <SectionHeader title="Нагорода" />
            <View style={styles.rewardPreview}>
              <View style={styles.rewardIcon}>
                <Feather color={colors.white} name="award" size={24} />
              </View>
              <View style={styles.rewardCopy}>
                <Text style={styles.rewardTitle}>{quest.reward.badge}</Text>
                <Text style={styles.rewardText}>+{quest.reward.xp} XP після завершення</Text>
              </View>
            </View>
          </Card>
        </View>

        <Card style={styles.card}>
          <SectionHeader
            subtitle="Запросіть друзів і відстежуйте, хто вже дійшов до точки"
            title="Командний квест"
          />
          <View style={styles.inviteCard}>
            <View>
              <Text style={styles.inviteTitle}>questme.app/invite/{quest.id}</Text>
              <Text style={styles.inviteText}>Посилання-запрошення для команди</Text>
            </View>
            <Button fullWidth={false} icon="link" onPress={() => Haptics.selectionAsync()} size="sm" title="Скопіювати" variant="secondary" />
          </View>
          <View style={styles.teamList}>
            {quest.team.map((member) => (
              <View key={member.name} style={styles.teamRow}>
                <View style={styles.memberAvatar}>
                  <Text style={styles.memberAvatarText}>{member.name.slice(0, 1).toUpperCase()}</Text>
                </View>
                <Text style={styles.memberName}>{member.name}</Text>
                <StatusPill status={member.status} />
              </View>
            ))}
          </View>
        </Card>

        <View style={styles.actions}>
          <Button icon="map" onPress={startQuest} title="Почати на карті" />
          <Button icon="arrow-left" onPress={() => router.back()} title="Повернутися до списку" variant="ghost" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatusPill({ status }: { status: 'ready' | 'walking' | 'arrived' }) {
  const label = status === 'arrived' ? 'На точці' : status === 'walking' ? 'В дорозі' : 'Готовий';
  const toneStyle = status === 'arrived' ? styles.statusArrived : status === 'walking' ? styles.statusWalking : styles.statusReady;

  return (
    <View style={[styles.statusPill, toneStyle]}>
      <Text style={styles.statusPillText}>{label}</Text>
    </View>
  );
}
