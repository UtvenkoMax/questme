import { StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '@/theme';

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
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    height: 72,
    justifyContent: 'center',
    width: 72,
  },
  avatarText: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 29,
  },
  badgeCard: {
    backgroundColor: colors.surfacePearl,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flex: 1,
    gap: spacing.xs,
    minWidth: 128,
    padding: spacing.md,
  },
  badgeCardLocked: {
    opacity: 0.56,
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  badgeIcon: {
    alignItems: 'center',
    backgroundColor: colors.borderSoft,
    borderRadius: radii.pill,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  badgeIconUnlocked: {
    backgroundColor: colors.primary,
  },
  badgeText: {
    ...typography.caption,
    color: colors.inkSubtle,
  },
  badgeTitle: {
    ...typography.captionStrong,
    color: colors.ink,
  },
  headerActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'flex-end',
  },
  historyCopy: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  historyIcon: {
    alignItems: 'center',
    backgroundColor: colors.successSoft,
    borderRadius: radii.pill,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  historyList: {
    gap: spacing.md,
  },
  historyRow: {
    alignItems: 'center',
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    paddingTop: spacing.md,
  },
  historyText: {
    ...typography.caption,
    color: colors.inkMuted,
  },
  historyTitle: {
    ...typography.captionStrong,
    color: colors.ink,
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
  levelFill: {
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    height: '100%',
  },
  levelTrack: {
    backgroundColor: colors.borderSoft,
    borderRadius: radii.pill,
    height: 8,
    overflow: 'hidden',
  },
  profileHero: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.lg,
  },
  profileHeroCopy: {
    flex: 1,
    gap: spacing.sm,
    minWidth: 0,
  },
  profileMeta: {
    ...typography.captionStrong,
    color: colors.primary,
  },
  profileName: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 33,
  },
  reauthBox: {
    backgroundColor: colors.surfacePearl,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
  },
  reauthText: {
    ...typography.body,
    color: colors.inkMuted,
  },
});
