import { StyleSheet } from 'react-native';
import { colors, radii, spacing, typography, hitSlop } from '@/theme';

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
    gap: spacing.md,
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
    color: colors.ink,
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 42,
  },
  titleCompact: {
    fontSize: 30,
    lineHeight: 36,
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
    borderRadius: 8,
    borderWidth: 2,
    height: 16,
    width: 16,
  },
  dotCompact: {
    borderRadius: 7,
    height: 14,
    width: 14,
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