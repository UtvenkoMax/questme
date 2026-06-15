import { StyleSheet } from 'react-native';
import { colors, radii, spacing, typography, hitSlop } from '@/theme';

export const styles = StyleSheet.create({
  content: {
    gap: spacing.xxl,
  },
  metrics: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  card: {
    gap: spacing.lg,
  },
  infoRow: {
    alignItems: 'center',
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
    paddingTop: spacing.md,
  },
  infoLabel: {
    ...typography.label,
    color: colors.inkMuted,
  },
  infoValue: {
    color: colors.ink,
    flex: 1,
    fontSize: 15,
    fontWeight: '900',
    textAlign: 'right',
  },
});