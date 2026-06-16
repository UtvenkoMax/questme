import { Platform, StyleSheet, type ViewStyle } from 'react-native';

import { colors, radii, shadows, spacing, typography } from '@/theme';

type ShadowStyle = ViewStyle & {
  boxShadow?: string;
};

export const THUMB_SIZE = 58;
export const TRACK_PADDING = 4;

const thumbShadow = Platform.select<ShadowStyle>({
  android: { elevation: 2 },
  web: {
    boxShadow: '0px 8px 18px rgba(0, 0, 0, 0.10)',
  },
  default: {
    shadowColor: '#000000',
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
  },
});

export const onboardingStyles = StyleSheet.create({
  screen: {
    flex: 1,
    overflow: 'hidden',
  },
  slideList: {
    ...StyleSheet.absoluteFillObject,
  },
  slide: {
    flex: 1,
    height: '100%',
    overflow: 'hidden',
  },
  imageWrap: {
    ...StyleSheet.absoluteFillObject,
  },
  illustration: {
    height: '100%',
    width: '100%',
  },
  panel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    borderWidth: 1,
    bottom: 0,
    gap: spacing.xl,
    left: 0,
    paddingBottom: spacing.sm,
    paddingTop: spacing.xxl,
    position: 'absolute',
    right: 0,
    ...shadows.floating,
  },
  panelCompact: {
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    gap: spacing.md,
    paddingTop: spacing.lg,
  },
  accentLine: {
    borderRadius: 2,
    height: 4,
    marginBottom: spacing.lg,
    width: 46,
  },
  title: {
    ...typography.titleCompact,
    color: colors.ink,
    letterSpacing: 0,
    marginBottom: spacing.sm,
  },
  titleCompact: {
    fontSize: 28,
    lineHeight: 34,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.inkMuted,
    marginBottom: spacing.lg,
  },
  subtitleCompact: {
    ...typography.caption,
    marginBottom: spacing.md,
  },
  dots: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dot: {
    borderRadius: radii.pill,
    height: 8,
  },
  dotActive: {
    width: 28,
  },
  dotInactive: {
    backgroundColor: colors.border,
    width: 8,
  },
  nextButton: {
    alignItems: 'center',
    borderRadius: radii.pill,
    justifyContent: 'center',
    minHeight: 50,
  },
  nextButtonCompact: {
    minHeight: 48,
  },
  nextButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.95 }],
  },
  nextButtonText: {
    ...typography.captionStrong,
    color: colors.white,
  },
  finalActions: {
    gap: spacing.md,
  },
  track: {
    backgroundColor: colors.surfacePearl,
    borderRadius: radii.pill,
    borderWidth: 1,
    height: 64,
    justifyContent: 'center',
    overflow: 'hidden',
    padding: TRACK_PADDING,
  },
  trackFill: {
    borderRadius: radii.pill,
    bottom: TRACK_PADDING,
    left: TRACK_PADDING,
    position: 'absolute',
    top: TRACK_PADDING,
  },
  trackText: {
    ...typography.captionStrong,
    textAlign: 'center',
  },
  thumb: {
    alignItems: 'center',
    borderRadius: THUMB_SIZE / 2,
    height: THUMB_SIZE,
    justifyContent: 'center',
    left: TRACK_PADDING,
    position: 'absolute',
    width: THUMB_SIZE,
    ...thumbShadow,
  },
  thumbArrow: {
    color: colors.white,
    fontSize: 25,
    fontWeight: '600',
    lineHeight: 29,
  },
  fallbackButton: {
    alignItems: 'center',
    borderRadius: radii.pill,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 50,
  },
  fallbackButtonText: {
    ...typography.captionStrong,
  },
});
