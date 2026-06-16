import { StyleSheet } from 'react-native';
import { colors, radii, spacing, typography, shadows } from '@/theme';

export const styles = StyleSheet.create({
  content: {
    gap: spacing.xxl,
    paddingBottom: spacing.huge,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  heroWrapper: {
    ...shadows.floating,
  },
  heroCard: {
    backgroundColor: colors.tile,
    borderWidth: 0,
    overflow: 'hidden',
  },
  heroInner: {
    padding: spacing.xxl,
    position: 'relative',
  },
  heroCopy: {
    gap: spacing.lg,
    position: 'relative',
    zIndex: 2,
  },
  heroPillContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  heroPill: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xxs,
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroPillAccent: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  heroPillText: {
    ...typography.captionStrong,
    color: colors.white,
  },
  heroTitle: {
    ...typography.title,
    color: colors.white,
  },
  heroText: {
    ...typography.subtitle,
    color: colors.bodyMutedOnDark,
    maxWidth: '85%',
  },
  progressWrapper: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    ...typography.caption,
    color: colors.bodyMutedOnDark,
  },
  progressPercent: {
    ...typography.captionStrong,
    color: colors.white,
  },
  heroProgressBar: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    height: 8,
  },
  metrics: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  grid: {
    gap: spacing.xxl,
  },
  gridWide: {
    alignItems: 'flex-start',
    flexDirection: 'row-reverse',
  },
  formCard: {
    flex: 0.8,
    gap: spacing.lg,
    backgroundColor: colors.surface,
  },
  personalList: {
    flex: 1.2,
    gap: spacing.md,
    minWidth: 0,
  },
  personalCard: {
    gap: spacing.xl,
    padding: spacing.xl,
  },
  personalCardDone: {
    backgroundColor: colors.successSoft,
    borderColor: colors.border,
  },
  personalHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  personalTitleWrap: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.md,
    minWidth: 0,
  },
  checkIcon: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radii.pill,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  checkIconDone: {
    backgroundColor: colors.success,
  },
  personalCopy: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  personalTitle: {
    ...typography.subtitle,
    color: colors.ink,
    fontWeight: '600',
  },
  personalTitleDone: {
    color: colors.inkSubtle,
    textDecorationLine: 'line-through',
  },
  personalDescription: {
    ...typography.body,
    color: colors.inkMuted,
  },
  exploreSection: {
    gap: spacing.lg,
  },
  exploreSectionPhone: {
    paddingTop: spacing.xxl,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  filterChip: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    ...typography.captionStrong,
    color: colors.inkMuted,
  },
  filterTextActive: {
    color: colors.white,
  },
  pressed: {
    opacity: 0.78,
  },
  routeGrid: {
    gap: spacing.lg,
  },
  routeGridWide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  routeItem: {
    width: '100%',
  },
  routeItemWide: {
    flexBasis: '48%',
    flexGrow: 1,
  },
});
