import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/theme';

export const styles = StyleSheet.create({
  content: {
    gap: spacing.xxl,
  },
  metrics: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  card: {
    gap: spacing.xl,
  },
  infoRow: {
    alignItems: 'center',
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
    paddingTop: spacing.lg,
  },
  infoLabel: {
    ...typography.label,
    color: colors.inkMuted,
  },
  infoValue: {
    ...typography.captionStrong,
    color: colors.ink,
    flex: 1,
    textAlign: 'right',
  },
});
