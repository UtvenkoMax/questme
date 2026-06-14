import type { ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

import { colors, radii, spacing, typography } from '@/theme';

type PageHeaderProps = {
  action?: ReactNode;
  eyebrow?: string;
  subtitle?: string;
  title: string;
};

export function PageHeader({ action, eyebrow, subtitle, title }: PageHeaderProps) {
  return (
    <View style={styles.pageHeader}>
      <View style={styles.pageHeaderCopy}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {action}
    </View>
  );
}

type SectionHeaderProps = {
  action?: ReactNode;
  subtitle?: string;
  title: string;
};

export function SectionHeader({ action, subtitle, title }: SectionHeaderProps) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionCopy}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
      </View>
      {action}
    </View>
  );
}

type PillProps = {
  children: ReactNode;
  tone?: 'default' | 'primary' | 'accent' | 'success' | 'danger';
};

export function Pill({ children, tone = 'default' }: PillProps) {
  return (
    <View style={[styles.pill, pillContainerStyles[tone]]}>
      <Text style={[styles.pillText, pillTextStyles[tone]]}>{children}</Text>
    </View>
  );
}

type ProgressBarProps = {
  percent: number;
  style?: StyleProp<ViewStyle>;
};

export function ProgressBar({ percent, style }: ProgressBarProps) {
  const clampedPercent = Math.min(Math.max(percent, 0), 100);
  return (
    <View style={[styles.progressTrack, style]}>
      <View style={[styles.progressFill, { width: `${clampedPercent}%` }]} />
    </View>
  );
}

type MetricProps = {
  label: string;
  value: string | number;
};

export function Metric({ label, value }: MetricProps) {
  return (
    <View style={styles.metric}>
      <Text numberOfLines={1} style={styles.metricValue}>
        {value}
      </Text>
      <Text numberOfLines={1} style={styles.metricLabel}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pageHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.lg,
    justifyContent: 'space-between',
    marginBottom: spacing.xxl,
  },
  pageHeaderCopy: {
    flex: 1,
    gap: spacing.sm,
  },
  eyebrow: {
    ...typography.eyebrow,
    color: colors.primary,
  },
  title: {
    ...typography.title,
    color: colors.ink,
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.inkMuted,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  sectionCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 25,
  },
  sectionSubtitle: {
    color: colors.inkMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  pill: {
    alignSelf: 'flex-start',
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '900',
  },
  defaultPill: {
    backgroundColor: colors.surfaceMuted,
  },
  defaultPillText: {
    color: colors.inkMuted,
  },
  primaryPill: {
    backgroundColor: colors.primarySoft,
  },
  primaryPillText: {
    color: colors.primary,
  },
  accentPill: {
    backgroundColor: colors.accentSoft,
  },
  accentPillText: {
    color: colors.warning,
  },
  successPill: {
    backgroundColor: colors.successSoft,
  },
  successPillText: {
    color: colors.success,
  },
  dangerPill: {
    backgroundColor: colors.dangerSoft,
  },
  dangerPillText: {
    color: colors.danger,
  },
  progressTrack: {
    backgroundColor: colors.border,
    borderRadius: radii.pill,
    height: 9,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: colors.accent,
    borderRadius: radii.pill,
    height: '100%',
  },
  metric: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
    padding: spacing.md,
  },
  metricValue: {
    color: colors.ink,
    fontSize: 19,
    fontWeight: '900',
    textAlign: 'center',
  },
  metricLabel: {
    color: colors.inkMuted,
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
  },
});

const pillContainerStyles: Record<NonNullable<PillProps['tone']>, ViewStyle> = {
  accent: styles.accentPill,
  danger: styles.dangerPill,
  default: styles.defaultPill,
  primary: styles.primaryPill,
  success: styles.successPill,
};

const pillTextStyles: Record<NonNullable<PillProps['tone']>, TextStyle> = {
  accent: styles.accentPillText,
  danger: styles.dangerPillText,
  default: styles.defaultPillText,
  primary: styles.primaryPillText,
  success: styles.successPillText,
};
