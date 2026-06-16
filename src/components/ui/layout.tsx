import type { ReactNode } from 'react';
import { Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

import { styles } from './layout.styles';

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
