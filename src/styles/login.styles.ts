import { StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '@/theme';

export const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingBottom: spacing.xxl,
    paddingTop: spacing.xxl,
  },
  contentWide: {
    alignSelf: 'center',
    maxWidth: 520,
    width: '100%',
  },
  contentCompact: {
    paddingBottom: spacing.lg,
    paddingTop: spacing.lg,
  },
  header: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingTop: spacing.lg,
    width: '100%',
  },
  headerCompact: {
    gap: spacing.sm,
    paddingTop: spacing.sm,
  },
  eyebrow: {
    ...typography.eyebrow,
    color: colors.primary,
  },
  title: {
    ...typography.title,
    color: colors.ink,
    letterSpacing: 0,
    textAlign: 'center',
  },
  titleCompact: {
    ...typography.titleCompact,
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.inkMuted,
    textAlign: 'center',
  },
  subtitleCompact: {
    fontSize: 14,
    lineHeight: 20,
  },
  dots: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  dotsCompact: {
    gap: spacing.sm,
  },
  dot: {
    borderColor: colors.borderStrong,
    borderRadius: radii.pill,
    borderWidth: 1,
    height: 12,
    width: 12,
  },
  dotCompact: {
    height: 10,
    width: 10,
  },
  dotFilled: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  actions: {
    alignSelf: 'stretch',
    gap: spacing.md,
  },
});
