import { StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '@/theme';

export const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    alignSelf: 'center',
    gap: spacing.xl,
    paddingBottom: spacing.xxxl,
    paddingTop: spacing.md,
    width: '100%',
  },
  contentWide: {
    maxWidth: 760,
  },
  hero: {
    borderRadius: radii.lg,
    height: 318,
    overflow: 'hidden',
  },
  heroCompact: {
    height: 244,
  },
  heroImage: {
    height: '100%',
    width: '100%',
  },
  heroShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.14)',
  },
  heroTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: spacing.lg,
    position: 'absolute',
    right: spacing.lg,
    top: spacing.lg,
  },
  heroBottom: {
    alignItems: 'center',
    bottom: spacing.lg,
    flexDirection: 'row',
    gap: spacing.sm,
    left: spacing.lg,
    position: 'absolute',
    right: spacing.lg,
  },
  ratingBadge: {
    alignItems: 'center',
    borderRadius: radii.pill,
    flexDirection: 'row',
    gap: 4,
    minHeight: 36,
    paddingHorizontal: spacing.md,
  },
  ratingText: {
    ...typography.captionStrong,
    color: colors.ink,
  },
  difficultyBadge: {
    alignItems: 'center',
    borderRadius: radii.pill,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  difficultyDot: {
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  difficultyText: {
    ...typography.captionStrong,
    fontSize: 12,
  },
  header: {
    gap: spacing.sm,
  },
  title: {
    ...typography.titleCompact,
    color: colors.ink,
  },
  titleCompact: {
    fontSize: 28,
    lineHeight: 34,
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.inkMuted,
  },
  metrics: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  card: {
    gap: spacing.xl,
  },
  gearItem: {
    alignItems: 'center',
    backgroundColor: colors.surfacePearl,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
  },
  gearList: {
    gap: spacing.sm,
  },
  gearText: {
    ...typography.captionStrong,
    color: colors.ink,
    flex: 1,
  },
  infoCard: {
    flex: 1,
    gap: spacing.lg,
    minWidth: 0,
  },
  infoGrid: {
    gap: spacing.lg,
  },
  infoGridWide: {
    flexDirection: 'row',
  },
  inviteCard: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radii.lg,
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  inviteText: {
    ...typography.caption,
    color: colors.primary,
  },
  inviteTitle: {
    ...typography.captionStrong,
    color: colors.primary,
  },
  memberAvatar: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radii.pill,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  memberAvatarText: {
    ...typography.captionStrong,
    color: colors.primary,
  },
  memberName: {
    ...typography.captionStrong,
    color: colors.ink,
    flex: 1,
  },
  progressCard: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xl,
  },
  progressCopy: {
    flex: 1,
    gap: spacing.md,
    minWidth: 0,
  },
  rewardCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  rewardIcon: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  rewardPreview: {
    alignItems: 'center',
    backgroundColor: colors.surfacePearl,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
  },
  rewardText: {
    ...typography.caption,
    color: colors.inkMuted,
  },
  rewardTitle: {
    ...typography.subtitle,
    color: colors.ink,
    fontWeight: '700',
  },
  statusArrived: {
    backgroundColor: colors.successSoft,
  },
  statusPill: {
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  statusPillText: {
    ...typography.captionStrong,
    color: colors.inkMuted,
  },
  statusReady: {
    backgroundColor: colors.surfacePearl,
  },
  statusWalking: {
    backgroundColor: colors.warningSoft,
  },
  teamList: {
    gap: spacing.sm,
  },
  teamRow: {
    alignItems: 'center',
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    paddingTop: spacing.md,
  },
  timeline: {
    gap: spacing.lg,
  },
  timelineCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  timelineDot: {
    alignItems: 'center',
    backgroundColor: colors.surfacePearl,
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: 1,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  timelineDotActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timelineDotText: {
    ...typography.captionStrong,
    color: colors.inkMuted,
  },
  timelineDotTextActive: {
    color: colors.white,
  },
  timelineItem: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
  },
  timelineText: {
    ...typography.caption,
    color: colors.inkMuted,
  },
  timelineTitle: {
    ...typography.captionStrong,
    color: colors.ink,
  },
  bodyText: {
    ...typography.body,
    color: colors.inkMuted,
  },
  locationRow: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radii.lg,
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
  },
  locationText: {
    ...typography.captionStrong,
    color: colors.primary,
    flex: 1,
  },
  actions: {
    gap: spacing.md,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xxl,
  },
});
