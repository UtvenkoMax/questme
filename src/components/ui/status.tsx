import { Feather } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radii, spacing, typography } from '@/theme';

type Tone = 'neutral' | 'success' | 'danger' | 'warning' | 'info';

const toneStyles: Record<Tone, { backgroundColor: string; color: string; icon: React.ComponentProps<typeof Feather>['name'] }> = {
  danger: { backgroundColor: colors.dangerSoft, color: colors.danger, icon: 'alert-triangle' },
  info: { backgroundColor: colors.blueSoft, color: colors.blue, icon: 'info' },
  neutral: { backgroundColor: colors.surfaceMuted, color: colors.inkMuted, icon: 'message-circle' },
  success: { backgroundColor: colors.successSoft, color: colors.success, icon: 'check-circle' },
  warning: { backgroundColor: colors.warningSoft, color: colors.warning, icon: 'alert-circle' },
};

type NoticeProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  tone?: Tone;
};

export function Notice({ children, style, tone = 'neutral' }: NoticeProps) {
  const toneStyle = toneStyles[tone];

  return (
    <View accessibilityLiveRegion="polite" style={[styles.notice, { backgroundColor: toneStyle.backgroundColor }, style]}>
      <Feather color={toneStyle.color} name={toneStyle.icon} size={18} />
      <Text style={[styles.noticeText, { color: toneStyle.color }]}>{children}</Text>
    </View>
  );
}

type EmptyStateProps = {
  action?: ReactNode;
  icon?: React.ComponentProps<typeof Feather>['name'];
  text: string;
  title: string;
};

export function EmptyState({ action, icon = 'inbox', text, title }: EmptyStateProps) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Feather color={colors.primary} name={icon} size={24} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyText}>{text}</Text>
      {action}
    </View>
  );
}

export function LoadingState({ text = 'Завантажуємо...' }: { text?: string }) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Feather color={colors.primary} name="loader" size={24} />
      </View>
      <Text style={styles.emptyTitle}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  notice: {
    alignItems: 'flex-start',
    borderRadius: radii.lg,
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.lg,
  },
  noticeText: {
    ...typography.captionStrong,
    flex: 1,
    lineHeight: 20,
  },
  empty: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.xl,
  },
  emptyIcon: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radii.pill,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  emptyTitle: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 29,
    textAlign: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.inkMuted,
    textAlign: 'center',
  },
});
