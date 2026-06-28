import { StyleSheet, Text, View } from 'react-native';

import { questColors } from '@/constants/colors';
import { radii, spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.block}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    backgroundColor: questColors.surfaceUp,
    borderColor: questColors.border,
    borderRadius: radii.sm,
    borderWidth: 1,
    flex: 1,
    gap: spacing.xxs,
    minWidth: 104,
    padding: spacing.md,
  },
  label: {
    ...typography.eyebrow,
    color: questColors.textSecondary,
    textTransform: 'uppercase',
  },
  value: {
    ...typography.titleCompact,
    color: questColors.textPrimary,
  },
});
