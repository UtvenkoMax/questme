import { StyleSheet } from 'react-native';

import { colors, radii, spacing, typography } from '@/theme';

const KEY_SIZE = 74;
const KEY_GAP = 16;
const KEYPAD_WIDTH = KEY_SIZE * 3 + KEY_GAP * 2;
const COMPACT_KEY_SIZE = 62;
const COMPACT_KEY_GAP = 10;
const COMPACT_KEYPAD_WIDTH = COMPACT_KEY_SIZE * 3 + COMPACT_KEY_GAP * 2;

export const pinCodeStyles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xxl,
  },
  contentWide: {
    alignSelf: 'center',
    maxWidth: 520,
    width: '100%',
  },
  contentCompact: {
    paddingBottom: spacing.lg,
    paddingTop: spacing.lg,
  },
  header: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingTop: spacing.lg,
    width: '100%',
  },
  headerCompact: {
    gap: spacing.sm,
    paddingTop: spacing.sm,
  },
  title: {
    ...typography.titleCompact,
    color: colors.ink,
    letterSpacing: 0,
    textAlign: 'center',
  },
  titleCompact: {
    fontSize: 28,
    lineHeight: 34,
  },
  message: {
    ...typography.body,
    color: colors.inkMuted,
    minHeight: 24,
    textAlign: 'center',
  },
  messageCompact: {
    fontSize: 14,
    lineHeight: 20,
  },
  pinPanel: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    width: '100%',
  },
  dots: {
    alignSelf: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
    minHeight: 18,
  },
  dotsCompact: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  dot: {
    borderColor: colors.borderStrong,
    borderRadius: radii.pill,
    borderWidth: 1,
    height: 12,
    width: 12,
  },
  dotCompact: {
    height: 10,
    width: 10,
  },
  dotFilled: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  keypad: {
    alignItems: 'center',
    gap: spacing.md,
    width: KEYPAD_WIDTH,
  },
  keypadCompact: {
    gap: COMPACT_KEY_GAP,
    width: COMPACT_KEYPAD_WIDTH,
  },
  keypadRow: {
    flexDirection: 'row',
    gap: KEY_GAP,
    justifyContent: 'center',
  },
  keypadRowCompact: {
    gap: COMPACT_KEY_GAP,
  },
  keypadBottomRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: KEYPAD_WIDTH,
  },
  keypadBottomRowCompact: {
    width: COMPACT_KEYPAD_WIDTH,
  },
  bottomSpacer: {
    width: KEY_SIZE,
  },
  bottomSpacerCompact: {
    width: COMPACT_KEY_SIZE,
  },
  key: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: KEY_SIZE / 2,
    borderWidth: 1,
    height: KEY_SIZE,
    justifyContent: 'center',
    width: KEY_SIZE,
  },
  keyCompact: {
    borderRadius: COMPACT_KEY_SIZE / 2,
    height: COMPACT_KEY_SIZE,
    width: COMPACT_KEY_SIZE,
  },
  keyPressed: {
    backgroundColor: colors.primarySoft,
    transform: [{ scale: 0.98 }],
  },
  keyText: {
    ...typography.titleCompact,
    color: colors.ink,
  },
  keyTextCompact: {
    fontSize: 25,
    lineHeight: 29,
  },
  cancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: KEY_SIZE,
    width: KEY_SIZE,
  },
  cancelButtonCompact: {
    minHeight: COMPACT_KEY_SIZE,
    width: COMPACT_KEY_SIZE,
  },
  cancelButtonPressed: {
    opacity: 0.62,
  },
  cancelText: {
    ...typography.captionStrong,
    color: colors.inkMuted,
  },
  actions: {
    alignSelf: 'stretch',
    gap: spacing.md,
    paddingBottom: spacing.sm,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    justifyContent: 'center',
    minHeight: 50,
  },
  buttonDisabled: {
    opacity: 0.52,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.95 }],
  },
  primaryButtonText: {
    ...typography.captionStrong,
    color: colors.white,
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 50,
  },
  secondaryButtonDisabled: {
    opacity: 0.52,
  },
  secondaryButtonText: {
    ...typography.captionStrong,
    color: colors.primary,
  },
});
