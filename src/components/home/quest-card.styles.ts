import { StyleSheet } from 'react-native';

import { colors, radii, shadows, spacing, typography } from '@/theme';

export const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    overflow: 'hidden',
    ...shadows.card,
  },
  cardPressed: {
    opacity: 0.9,
  },
  imageContainer: {
    height: 176,
    position: 'relative',
  },
  imageContainerCompact: {
    height: 148,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  imageShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
  },
  imageOverlay: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: spacing.md,
    position: 'absolute',
    right: spacing.md,
    top: spacing.md,
  },
  badgeStack: {
    gap: spacing.xs,
    maxWidth: '62%',
  },
  categoryBadge: {
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  categoryText: {
    ...typography.captionStrong,
    color: colors.white,
  },
  ratingBadge: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  smallBadge: {
    ...typography.captionStrong,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: radii.pill,
    color: colors.ink,
    overflow: 'hidden',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  smallBadgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  starRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  starIcon: {
    color: colors.primary,
    fontSize: 12,
  },
  ratingText: {
    ...typography.captionStrong,
    color: colors.ink,
  },
  content: {
    gap: spacing.md,
    padding: spacing.lg,
  },
  contentCompact: {
    gap: spacing.sm,
    padding: spacing.md,
  },
  titleRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  title: {
    ...typography.subtitle,
    color: colors.ink,
    flex: 1,
    fontWeight: '600',
  },
  titleCompact: {
    fontSize: 16,
    lineHeight: 21,
  },
  difficultyBadge: {
    alignItems: 'center',
    borderRadius: radii.pill,
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
  },
  difficultyDot: {
    borderRadius: 3.5,
    height: 7,
    width: 7,
  },
  difficultyText: {
    ...typography.captionStrong,
    fontSize: 11,
  },
  description: {
    ...typography.caption,
    color: colors.inkMuted,
  },
  metaRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  metaItem: {
    alignItems: 'center',
    backgroundColor: colors.surfacePearl,
    borderRadius: radii.sm,
    flex: 1,
    flexDirection: 'row',
    gap: 5,
    minWidth: 0,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  metaText: {
    ...typography.captionStrong,
    color: colors.inkMuted,
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  location: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    minWidth: 0,
  },
  locationText: {
    ...typography.captionStrong,
    color: colors.inkMuted,
    flex: 1,
  },
  detailButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    justifyContent: 'center',
    minHeight: 36,
    paddingHorizontal: spacing.md,
  },
  detailButtonText: {
    ...typography.captionStrong,
    color: colors.white,
  },
});
