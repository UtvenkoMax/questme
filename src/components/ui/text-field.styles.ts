import { Platform, StyleSheet } from 'react-native';
import { colors, radii, spacing, typography, hitSlop } from '@/theme';

export const styles = StyleSheet.create({
  field: {
    gap: spacing.xs,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  label: {
    ...typography.label,
    color: colors.inkMuted,
    fontSize: 13,
  },
  labelFocused: {
    color: colors.primary,
  },
  labelError: {
    color: colors.danger,
  },
  inputWrapper: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    ...Platform.select({
      web: { transition: 'all 0.2s ease-in-out' } as any
    })
  },
  inputWrapperFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
    ...Platform.select({
      web: { boxShadow: `0 0 0 3px ${colors.primarySoft}` } as any,
      default: { elevation: 2, shadowColor: colors.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }
    })
  },
  inputWrapperError: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerSoft,
  },
  inputWrapperMultiline: {
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
  },
  input: {
    flex: 1,
    color: colors.ink,
    fontSize: 16,
    fontWeight: '500',
    height: '100%',
    minHeight: 56,
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  error: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    paddingHorizontal: 2,
  },
  hint: {
    color: colors.inkSubtle,
    fontSize: 13,
    lineHeight: 18,
    paddingHorizontal: 2,
  },
});