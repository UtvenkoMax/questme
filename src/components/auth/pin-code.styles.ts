import { StyleSheet } from 'react-native';

import { colors, radii, spacing } from '@/theme';

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
    gap: spacing.md,
    paddingTop: spacing.lg,
    width: '100%',
  },
  headerCompact: {
    gap: spacing.sm,
    paddingTop: spacing.sm,
  },
  title: {
    color: colors.ink,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 40,
    textAlign: 'center',
  },
  titleCompact: {
    fontSize: 28,
    lineHeight: 34,
  },
  message: {
    color: colors.inkMuted,
    fontSize: 16,
    lineHeight: 23,
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
    borderRadius: 8,
    borderWidth: 2,
    height: 16,
    width: 16,
  },
  dotCompact: {
    borderRadius: 7,
    height: 14,
    width: 14,
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
    color: colors.ink,
    fontSize: 30,
    fontWeight: '700',
    lineHeight: 34,
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
    color: colors.inkMuted,
    fontSize: 13,
    fontWeight: '900',
  },
  actions: {
    alignSelf: 'stretch',
    gap: spacing.md,
    paddingBottom: spacing.sm,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    justifyContent: 'center',
    minHeight: 54,
  },
  buttonDisabled: {
    opacity: 0.52,
  },
  buttonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '900',
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 52,
  },
  secondaryButtonDisabled: {
    opacity: 0.52,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '900',
  },
});
