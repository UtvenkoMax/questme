import type { ReactNode } from 'react';
import { Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

import { useAppTheme } from '@/components/providers/app-preferences';

import { styles } from './layout.styles';

type PageHeaderProps = {
  action?: ReactNode;
  eyebrow?: string;
  subtitle?: string;
  title: string;
};

export function PageHeader({ action, eyebrow, subtitle, title }: PageHeaderProps) {
  const theme = useAppTheme();

  return (
    <View style={styles.pageHeader}>
      <View style={styles.pageHeaderCopy}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={[styles.title, { color: theme.colors.ink }]}>{title}</Text>
        {subtitle ? <Text style={[styles.subtitle, { color: theme.colors.inkMuted }]}>{subtitle}</Text> : null}
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
  const theme = useAppTheme();

  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionCopy}>
        <Text style={[styles.sectionTitle, { color: theme.colors.ink }]}>{title}</Text>
        {subtitle ? <Text style={[styles.sectionSubtitle, { color: theme.colors.inkSubtle }]}>{subtitle}</Text> : null}
      </View>
      {action}
    </View>
  );
}

type PillProps = {
  children: ReactNode;
  tone?: 'default' | 'primary' | 'accent' | 'success' | 'danger';
};

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
  const theme = useAppTheme();

  return (
    <View style={[styles.metric, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <Text numberOfLines={1} style={[styles.metricValue, { color: theme.colors.ink }]}>
        {value}
      </Text>
      <Text numberOfLines={1} style={[styles.metricLabel, { color: theme.colors.inkSubtle }]}>
        {label}
      </Text>
    </View>
  );
}
