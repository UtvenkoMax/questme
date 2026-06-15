import { StyleSheet } from 'react-native';
import { colors, radii, spacing, typography, hitSlop } from '@/theme';

export const styles = StyleSheet.create({
  content: {
    gap: spacing.xl,
  },
  card: {
    gap: spacing.lg,
  },
  actionRow: {
    alignItems: 'center',
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
    paddingTop: spacing.md,
  },
  actionCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  actionLabel: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '900',
  },
  actionDescription: {
    ...typography.body,
    color: colors.inkMuted,
  },
});