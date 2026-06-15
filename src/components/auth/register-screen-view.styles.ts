import { StyleSheet } from 'react-native';
import { colors, radii, spacing, typography, hitSlop } from '@/theme';

export const styles = StyleSheet.create({
  content: {
    gap: spacing.xxl,
  },
  form: {
    gap: spacing.lg,
  },
  inlineButton: {
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
  },
  inlineButtonPressed: {
    opacity: 0.64,
  },
  inlineButtonText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '900',
  },
  passwordStrength: {
    gap: spacing.sm,
  },
  strengthBars: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  strengthBar: {
    backgroundColor: colors.border,
    borderRadius: 999,
    flex: 1,
    height: 7,
  },
  strengthBarActive: {
    backgroundColor: colors.accent,
  },
  strengthBarStrong: {
    backgroundColor: colors.success,
  },
  helperText: {
    color: colors.inkMuted,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  submitWrapper: {
    marginTop: spacing.md,
  }
});