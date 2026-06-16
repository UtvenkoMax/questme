import { StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '@/theme';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.canvasParchment,
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  statusCard: {
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    left: spacing.lg,
    padding: spacing.md,
    position: 'absolute',
    right: spacing.lg,
    top: 54,
  },
  statusIcon: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radii.pill,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  statusCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  statusEyebrow: {
    ...typography.eyebrow,
    color: colors.primary,
  },
  statusTitle: {
    ...typography.subtitle,
    color: colors.ink,
    fontWeight: '600',
  },
  statusText: {
    ...typography.caption,
    color: colors.inkMuted,
  },
  errorContainer: {
    backgroundColor: colors.danger,
    borderRadius: radii.md,
    bottom: spacing.xl,
    left: spacing.lg,
    padding: spacing.md,
    position: 'absolute',
    right: spacing.lg,
  },
  errorText: {
    ...typography.captionStrong,
    color: colors.white,
    textAlign: 'center',
  },
});
