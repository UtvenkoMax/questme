import { UploadSimple } from 'phosphor-react-native';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { SubmitProofModal } from '@/components/tasks/SubmitProofModal';
import { ChaosBadge, ChaosButton, ProgressLine, SectionKicker } from '@/components/ui/chaos';
import { Screen } from '@/components/ui/screen';
import { questColors } from '@/constants/colors';
import { radii, spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { trackerColumns, type TrackerQuest } from '@/data/questme';

export default function TasksScreen() {
  const { width } = useWindowDimensions();
  const [selectedQuest, setSelectedQuest] = useState<TrackerQuest | null>(null);
  const columnWidth = Math.min(width - spacing.lg * 2, 390);

  return (
    <Screen contentStyle={styles.content} scroll={false} wide>
      <SectionKicker eyebrow="Tracker" title="Мої завдання" />
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={columnWidth + spacing.md}
        contentContainerStyle={styles.columns}>
        {trackerColumns.map((column) => (
          <View key={column.id} style={[styles.column, { width: columnWidth }]}>
            <View style={styles.columnHeader}>
              <Text style={styles.columnTitle}>{column.title}</Text>
              <Text style={styles.columnSubtitle}>{column.subtitle}</Text>
            </View>
            {column.quests.map((quest) => (
              <TaskItem key={quest.id} quest={quest} onSubmit={() => setSelectedQuest(quest)} />
            ))}
          </View>
        ))}
      </ScrollView>
      <SubmitProofModal quest={selectedQuest} onClose={() => setSelectedQuest(null)} />
    </Screen>
  );
}

function TaskItem({ onSubmit, quest }: { onSubmit: () => void; quest: TrackerQuest }) {
  const tone = quest.status === 'active' ? 'electric' : quest.status === 'review' ? 'acid' : 'success';
  return (
    <View style={styles.taskCard}>
      <View style={styles.taskTop}>
        <ChaosBadge tone={tone}>{quest.status}</ChaosBadge>
        <Text style={styles.reward}>{quest.reward} грн</Text>
      </View>
      <Text style={styles.taskTitle}>{quest.title}</Text>
      <Text style={styles.taskMeta}>{quest.proofType} · {quest.deadline}</Text>
      <ProgressLine percent={quest.progress} tone={tone} />
      {quest.status === 'active' ? (
        <ChaosButton
          icon={<UploadSimple color={questColors.void} size={18} weight="bold" />}
          label="Завантажити виконання"
          onPress={onSubmit}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    backgroundColor: questColors.surface,
    borderColor: questColors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.md,
  },
  columnHeader: {
    gap: spacing.xxs,
  },
  columnSubtitle: {
    ...typography.caption,
    color: questColors.textSecondary,
  },
  columnTitle: {
    ...typography.titleCompact,
    color: questColors.textPrimary,
  },
  columns: {
    gap: spacing.md,
    paddingBottom: 120,
    paddingRight: spacing.lg,
  },
  content: {
    flex: 1,
    gap: spacing.lg,
    paddingBottom: 0,
  },
  reward: {
    ...typography.label,
    color: questColors.ember,
  },
  taskCard: {
    backgroundColor: questColors.surfaceUp,
    borderColor: questColors.border,
    borderRadius: radii.sm,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.md,
  },
  taskMeta: {
    ...typography.caption,
    color: questColors.textSecondary,
  },
  taskTitle: {
    ...typography.subtitle,
    color: questColors.textPrimary,
  },
  taskTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
