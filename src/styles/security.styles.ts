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
  chip: {
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    ...typography.captionStrong,
    color: colors.inkMuted,
  },
  chipTextSelected: {
    color: colors.white,
  },
  choiceGroup: {
    gap: spacing.sm,
  },
  choiceLabel: {
    ...typography.label,
    color: colors.ink,
  },
  segment: {
    backgroundColor: colors.surfacePearl,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    padding: spacing.xxs,
  },
  segmentButton: {
    alignItems: 'center',
    borderRadius: 999,
    flex: 1,
    minHeight: 38,
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  segmentButtonSelected: {
    backgroundColor: colors.primary,
  },
  segmentText: {
    ...typography.captionStrong,
    color: colors.inkMuted,
    textAlign: 'center',
  },
  segmentTextSelected: {
    color: colors.white,
  },
});
