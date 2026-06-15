import { StyleSheet } from 'react-native';
import { colors, radii, spacing, typography, hitSlop } from '@/theme';

export const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    alignSelf: 'center',
    gap: spacing.xxl,
    paddingBottom: spacing.xxxl,
    paddingTop: spacing.md,
    width: '100%',
  },
  contentWide: {
    maxWidth: 760,
  },
  hero: {
    borderRadius: radii.xl,
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
    backgroundColor: 'rgba(16, 24, 32, 0.18)',
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
    color: colors.ink,
    fontSize: 13,
    fontWeight: '900',
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
    fontSize: 12,
    fontWeight: '900',
  },
  header: {
    gap: spacing.sm,
  },
  title: {
    color: colors.ink,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 40,
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
    gap: spacing.lg,
  },
  bodyText: {
    ...typography.body,
    color: colors.inkMuted,
  },
  locationRow: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radii.md,
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
  },
  locationText: {
    color: colors.primary,
    flex: 1,
    fontSize: 14,
    fontWeight: '900',
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