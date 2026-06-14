import { Platform, StyleSheet, type ViewStyle } from 'react-native';

import { colors, radii, shadows, spacing } from '@/theme';

type ShadowStyle = ViewStyle & {
  boxShadow?: string;
};

export const THUMB_SIZE = 58;
export const TRACK_PADDING = 4;

const thumbShadow = Platform.select<ShadowStyle>({
  android: { elevation: 4 },
  web: {
    boxShadow: '0px 4px 10px rgba(16, 24, 32, 0.18)',
  },
  default: {
    shadowColor: '#101820',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
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
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    bottom: 0,
    gap: spacing.lg,
    left: 0,
    paddingBottom: spacing.sm,
    paddingTop: spacing.xl,
    position: 'absolute',
    right: 0,
    ...shadows.floating,
  },
  panelCompact: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
    color: colors.ink,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 34,
    marginBottom: spacing.sm,
  },
  titleCompact: {
    fontSize: 23,
    lineHeight: 29,
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.inkMuted,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  subtitleCompact: {
    fontSize: 14,
    lineHeight: 20,
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
    borderRadius: radii.md,
    justifyContent: 'center',
    minHeight: 54,
  },
  nextButtonCompact: {
    minHeight: 48,
  },
  nextButtonPressed: {
    opacity: 0.84,
    transform: [{ scale: 0.99 }],
  },
  nextButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0,
  },
  finalActions: {
    gap: spacing.md,
  },
  track: {
    backgroundColor: colors.surfaceMuted,
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
    fontSize: 15,
    fontWeight: '900',
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
    fontWeight: '900',
    lineHeight: 29,
  },
  fallbackButton: {
    alignItems: 'center',
    borderRadius: radii.md,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 52,
  },
  fallbackButtonText: {
    fontSize: 15,
    fontWeight: '900',
  },
});
