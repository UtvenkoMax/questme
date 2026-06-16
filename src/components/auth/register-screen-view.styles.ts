import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/theme';

export const styles = StyleSheet.create({
  content: {
    gap: spacing.xxl,
    position: 'relative',
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
    ...typography.captionStrong,
    color: colors.primary,
  },
  passwordStrength: {
    gap: spacing.sm,
  },
  strengthBars: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  strengthBar: {
    backgroundColor: colors.borderSoft,
    borderRadius: 999,
    flex: 1,
    height: 6,
  },
  strengthBarActive: {
    backgroundColor: colors.primary,
  },
  strengthBarStrong: {
    backgroundColor: colors.success,
  },
  helperText: {
    ...typography.caption,
    color: colors.inkMuted,
  },
  submitWrapper: {
    marginTop: spacing.md,
  }
});
