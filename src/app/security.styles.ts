import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/theme';

export const styles = StyleSheet.create({
  content: {
    gap: spacing.xl,
  },
  card: {
    gap: spacing.xl,
  },
  actionRow: {
    alignItems: 'center',
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
    paddingTop: spacing.lg,
  },
  actionCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  actionLabel: {
    ...typography.body,
    color: colors.ink,
    fontWeight: '600',
  },
  actionDescription: {
    ...typography.body,
    color: colors.inkMuted,
  },
});
