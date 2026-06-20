import { StyleSheet, Text, View } from 'react-native';
import { ClockCountdown, CurrencyCircleDollar } from 'phosphor-react-native';

import { questColors } from '@/constants/colors';
import { radii, spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { ChaosBadge, ChaosButton } from '@/components/ui/chaos';

type QuestPreviewCardProps = {
  title: string;
  proofType: string;
  reward: number;
  deadline: string;
  onPublish?: () => void;
};

export function QuestPreviewCard({ deadline, onPublish, proofType, reward, title }: QuestPreviewCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <ChaosBadge tone="electric">{proofType}</ChaosBadge>
        <ChaosBadge tone="acid">SAFE PAY</ChaosBadge>
      </View>
      <Text style={styles.title}>{title || 'Зніми себе за секунду до того, як щось впаде'}</Text>
      <View style={styles.metaRow}>
        <View style={styles.meta}>
          <CurrencyCircleDollar color={questColors.ember} size={18} weight="fill" />
          <Text style={styles.metaText}>{reward} грн</Text>
        </View>
        <View style={styles.meta}>
          <ClockCountdown color={questColors.acid} size={18} />
          <Text style={styles.metaText}>{deadline}</Text>
        </View>
      </View>
      {onPublish ? <ChaosButton label="Опублікувати" onPress={onPublish} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: questColors.surface,
    borderColor: questColors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    gap: spacing.lg,
    overflow: 'hidden',
    padding: spacing.lg,
  },
  meta: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  metaText: {
    ...typography.label,
    color: questColors.textPrimary,
  },
  title: {
    ...typography.titleCompact,
    color: questColors.textPrimary,
  },
  top: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
