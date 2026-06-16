import { Platform, StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '@/theme';

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
    borderRadius: radii.pill,
    borderWidth: 1,
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    ...Platform.select({
      web: { transition: 'border-color 0.2s ease, box-shadow 0.2s ease' } as any
    })
  },
  inputWrapperFocused: {
    borderColor: colors.primaryFocus,
    backgroundColor: colors.surface,
    ...Platform.select({
      web: { boxShadow: `0 0 0 3px ${colors.primarySoft}` } as any,
      default: { elevation: 1, shadowColor: colors.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4 }
    })
  },
  inputWrapperError: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerSoft,
  },
  inputWrapperMultiline: {
    alignItems: 'flex-start',
    borderRadius: radii.lg,
    paddingVertical: spacing.sm,
  },
  input: {
    flex: 1,
    color: colors.ink,
    ...typography.body,
    height: '100%',
    minHeight: 50,
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  error: {
    color: colors.danger,
    ...typography.captionStrong,
    paddingHorizontal: 2,
  },
  hint: {
    ...typography.caption,
    color: colors.inkSubtle,
    paddingHorizontal: 2,
  },
});
