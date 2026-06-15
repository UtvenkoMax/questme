import { StyleSheet } from 'react-native';
import { colors, radii, spacing, typography, hitSlop, shadows } from '@/theme';

export const styles = StyleSheet.create({
  content: {
    gap: spacing.xxxl,
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
    backgroundColor: colors.primary,
    borderWidth: 0,
    overflow: 'hidden',
  },
  heroInner: {
    padding: spacing.xl,
    position: 'relative',
  },
  heroCopy: {
    gap: spacing.md,
    position: 'relative',
    zIndex: 2,
  },
  heroPillContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  heroPill: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xxs,
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroPillAccent: {
    backgroundColor: colors.accent,
  },
  heroPillText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '800',
  },
  heroTitle: {
    color: colors.white,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -0.5,
    lineHeight: 40,
  },
  heroText: {
    ...typography.subtitle,
    color: 'rgba(255,255,255,0.85)',
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
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontWeight: '700',
  },
  progressPercent: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '900',
  },
  heroProgressBar: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    height: 12,
  },
  metrics: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  grid: {
    gap: spacing.xxxl,
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
    gap: spacing.lg,
    padding: spacing.lg,
  },
  personalCardDone: {
    backgroundColor: colors.successSoft,
    borderColor: '#A7F3D0',
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
    borderRadius: radii.md,
    height: 40,
    justifyContent: 'center',
    width: 40,
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
    color: colors.ink,
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 24,
  },
  personalTitleDone: {
    color: colors.success,
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
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  filterText: {
    color: colors.inkMuted,
    fontSize: 14,
    fontWeight: '700',
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