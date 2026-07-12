import { StyleSheet } from 'react-native';

import { colors, radii, spacing, typography } from '@/theme';

export const startScreenStyles = StyleSheet.create({
  createProfileButton: { alignItems: 'center', borderColor: colors.border, borderRadius: radii.md, borderWidth: 1, justifyContent: 'center', minHeight: 52, paddingHorizontal: spacing.lg },
  createProfileText: { ...typography.captionStrong, color: colors.ink },
  loginButton: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: radii.md, justifyContent: 'center', minHeight: 52, paddingHorizontal: spacing.lg },
  loginButtonPressed: { opacity: 0.82 }, loginButtonText: { ...typography.captionStrong, color: colors.white }, loginPanel: { gap: spacing.sm },
  sessionEyebrow: { ...typography.eyebrow, color: colors.inkSubtle, textTransform: 'uppercase' }, sessionHeader: { gap: spacing.xxs, paddingVertical: spacing.sm }, sessionName: { ...typography.titleCompact, color: colors.ink },
});
