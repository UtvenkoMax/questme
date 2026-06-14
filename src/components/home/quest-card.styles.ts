import { StyleSheet } from 'react-native';

import { colors, radii, shadows, spacing } from '@/theme';

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
    transform: [{ scale: 0.99 }],
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
    backgroundColor: 'rgba(16, 24, 32, 0.12)',
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
  categoryBadge: {
    borderRadius: radii.pill,
    maxWidth: '58%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  categoryText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
  },
  ratingBadge: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  starRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  starIcon: {
    color: colors.accent,
    fontSize: 12,
  },
  ratingText: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: '900',
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
    color: colors.ink,
    flex: 1,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 23,
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
    fontSize: 11,
    fontWeight: '900',
  },
  description: {
    color: colors.inkMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  metaItem: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.sm,
    flex: 1,
    flexDirection: 'row',
    gap: 5,
    minWidth: 0,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  metaText: {
    color: colors.inkMuted,
    flex: 1,
    fontSize: 12,
    fontWeight: '800',
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
    color: colors.inkMuted,
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
  },
  detailButton: {
    alignItems: 'center',
    borderRadius: radii.sm,
    justifyContent: 'center',
    minHeight: 34,
    paddingHorizontal: spacing.md,
  },
  detailButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '900',
  },
});
