import { StyleSheet } from 'react-native';
import { colors, radii, spacing, typography, hitSlop } from '@/theme';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundAlt,
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  statusCard: {
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
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
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
  },
  statusText: {
    color: colors.inkMuted,
    fontSize: 13,
    lineHeight: 19,
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
    color: colors.white,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
    textAlign: 'center',
  },
});