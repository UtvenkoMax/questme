import { StyleSheet } from 'react-native';
import { colors, radii, spacing, typography, hitSlop } from '@/theme';

export const styles = StyleSheet.create({
  pageHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.lg,
    justifyContent: 'space-between',
    marginBottom: spacing.xxl,
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
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 25,
  },
  sectionSubtitle: {
    color: colors.inkMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  pill: {
    alignSelf: 'flex-start',
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '900',
  },
  defaultPill: {
    backgroundColor: colors.surfaceMuted,
  },
  defaultPillText: {
    color: colors.inkMuted,
  },
  primaryPill: {
    backgroundColor: colors.primarySoft,
  },
  primaryPillText: {
    color: colors.primary,
  },
  accentPill: {
    backgroundColor: colors.accentSoft,
  },
  accentPillText: {
    color: colors.warning,
  },
  successPill: {
    backgroundColor: colors.successSoft,
  },
  successPillText: {
    color: colors.success,
  },
  dangerPill: {
    backgroundColor: colors.dangerSoft,
  },
  dangerPillText: {
    color: colors.danger,
  },
  progressTrack: {
    backgroundColor: colors.border,
    borderRadius: radii.pill,
    height: 9,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: colors.accent,
    borderRadius: radii.pill,
    height: '100%',
  },
  metric: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
    padding: spacing.md,
  },
  metricValue: {
    color: colors.ink,
    fontSize: 19,
    fontWeight: '900',
    textAlign: 'center',
  },
  metricLabel: {
    color: colors.inkMuted,
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
  },
});