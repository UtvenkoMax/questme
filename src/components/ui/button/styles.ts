import { StyleSheet } from 'react-native';
import { colors, radii, spacing, typography, hitSlop } from '@/theme';

export const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderRadius: radii.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  sm: {
    minHeight: 40,
    paddingHorizontal: spacing.md,
  },
  md: {
    minHeight: 48,
  },
  lg: {
    minHeight: 56,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  primary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primarySoft,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  danger: {
    backgroundColor: colors.dangerSoft,
    borderColor: colors.dangerSoft,
  },
  success: {
    backgroundColor: colors.successSoft,
    borderColor: colors.successSoft,
  },
  disabled: {
    opacity: 0.52,
  },
  text: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  iconButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
});