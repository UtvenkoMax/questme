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
  bottomSheet: {
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    bottom: spacing.lg,
    gap: spacing.sm,
    left: spacing.md,
    padding: spacing.sm,
    position: 'absolute',
    right: spacing.md,
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
    bottom: 192,
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
  geofenceSuccess: {
    ...typography.captionStrong,
    color: colors.success,
  },
  geofenceToast: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: colors.success,
    borderRadius: radii.pill,
    bottom: 184,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    position: 'absolute',
  },
  geofenceToastText: {
    ...typography.captionStrong,
    color: colors.white,
  },
  sheetActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  sheetCard: {
    gap: spacing.md,
    padding: spacing.sm,
  },
  sheetCardSelected: {
    backgroundColor: colors.surfacePearl,
    borderRadius: radii.md,
  },
  sheetCopy: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  sheetHandle: {
    alignSelf: 'center',
    backgroundColor: colors.borderStrong,
    borderRadius: radii.pill,
    height: 4,
    width: 44,
  },
  sheetHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  sheetIcon: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radii.pill,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  sheetMeta: {
    ...typography.caption,
    color: colors.inkMuted,
  },
  sheetTitle: {
    ...typography.subtitle,
    color: colors.ink,
    fontWeight: '700',
  },
});
