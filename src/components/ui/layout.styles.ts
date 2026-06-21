import { StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '@/theme';

export const styles = StyleSheet.create({
  pageHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.xl,
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  pageHeaderCopy: {
    flex: 1,
    gap: spacing.sm,
  },
  eyebrow: {
    ...typography.eyebrow,
    color: colors.primary,
  },
  title: {
    ...typography.title,
    color: colors.ink,
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.inkMuted,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  sectionCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 29,
  },
  sectionSubtitle: {
    ...typography.caption,
    color: colors.inkSubtle,
  },
  pill: {
    alignSelf: 'flex-start',
    borderRadius: radii.pill,
    minHeight: 32,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  pillText: {
    ...typography.captionStrong,
  },
  defaultPill: {
    backgroundColor: colors.surfacePearl,
    borderColor: colors.borderSoft,
    borderWidth: 1,
  },
  defaultPillText: {
    color: colors.inkMuted,
  },
  primaryPill: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primarySoft,
    borderWidth: 1,
  },
  primaryPillText: {
    color: colors.primary,
  },
  accentPill: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primarySoft,
    borderWidth: 1,
  },
  accentPillText: {
    color: colors.primary,
  },
  successPill: {
    backgroundColor: colors.successSoft,
    borderColor: colors.successSoft,
    borderWidth: 1,
  },
  successPillText: {
    color: colors.success,
  },
  dangerPill: {
    backgroundColor: colors.dangerSoft,
    borderColor: colors.dangerSoft,
    borderWidth: 1,
  },
  dangerPillText: {
    color: colors.danger,
  },
  progressTrack: {
    backgroundColor: colors.borderSoft,
    borderRadius: radii.pill,
    height: 8,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    height: '100%',
  },
  metric: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
    padding: spacing.lg,
  },
  metricValue: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 29,
    textAlign: 'center',
  },
  metricLabel: {
    ...typography.caption,
    color: colors.inkSubtle,
    textAlign: 'center',
  },
});
