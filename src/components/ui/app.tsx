import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps, type ViewStyle } from 'react-native';

import { colors, control, opacity, radii, spacing, typography } from '@/theme';

type ButtonTone = 'primary' | 'secondary' | 'danger' | 'quiet';

type AppButtonProps = {
  disabled?: boolean;
  label: string;
  onPress: () => void;
  tone?: ButtonTone;
};

const buttonTone: Record<ButtonTone, { background: string; border: string; text: string }> = {
  danger: { background: colors.danger, border: colors.danger, text: colors.white },
  primary: { background: colors.primary, border: colors.primary, text: colors.white },
  quiet: { background: 'transparent', border: colors.border, text: colors.ink },
  secondary: { background: colors.primarySoft, border: colors.primary, text: colors.primaryOnDark },
};

export function AppButton({ disabled = false, label, onPress, tone = 'primary' }: AppButtonProps) {
  const toneStyle = buttonTone[tone];
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
        onPress();
      }}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: toneStyle.background, borderColor: toneStyle.border },
        (pressed || disabled) && { opacity: disabled ? opacity.disabled : opacity.pressed },
      ]}>
      <Text style={[styles.buttonText, { color: toneStyle.text }]}>{label}</Text>
    </Pressable>
  );
}

export function IconAction({ accessibilityLabel, icon, onPress }: { accessibilityLabel: string; icon: React.ComponentProps<typeof Feather>['name']; onPress: () => void }) {
  return (
    <Pressable accessibilityLabel={accessibilityLabel} accessibilityRole="button" hitSlop={8} onPress={onPress} style={({ pressed }) => [styles.iconAction, pressed && { opacity: opacity.pressed }]}>
      <Feather color={colors.ink} name={icon} size={20} />
    </Pressable>
  );
}

export function AppCard({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Avatar({ label, size = 40 }: { label: string; size?: number }) {
  return <View accessibilityLabel={`Avatar ${label}`} style={[styles.avatar, { borderRadius: size / 2, height: size, width: size }]}><Text style={styles.avatarText}>{label.slice(0, 2).toUpperCase()}</Text></View>;
}

export function Badge({ label, tone = 'neutral' }: { label: string; tone?: 'neutral' | 'reward' | 'success' }) {
  const badgeStyles = tone === 'reward' ? styles.badgeReward : tone === 'success' ? styles.badgeSuccess : styles.badge;
  const textStyles = tone === 'reward' ? styles.badgeRewardText : tone === 'success' ? styles.badgeSuccessText : styles.badgeText;
  return <View style={badgeStyles}><Text style={textStyles}>{label}</Text></View>;
}

export function SearchInput({ onClear, ...props }: TextInputProps & { onClear?: () => void }) {
  return (
    <View style={styles.search}>
      <Feather color={colors.inkSubtle} name="search" size={19} />
      <TextInput accessibilityLabel="Search quests" clearButtonMode="while-editing" placeholderTextColor={colors.inkSubtle} returnKeyType="search" style={styles.searchInput} {...props} />
      {props.value ? <IconAction accessibilityLabel="Clear search" icon="x" onPress={onClear ?? (() => undefined)} /> : null}
    </View>
  );
}

export function SectionHeader({ action, eyebrow, title }: { action?: ReactNode; eyebrow?: string; title: string }) {
  return <View style={styles.sectionHeader}><View style={styles.sectionCopy}>{eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}<Text style={styles.sectionTitle}>{title}</Text></View>{action}</View>;
}

const styles = StyleSheet.create({
  avatar: { alignItems: 'center', backgroundColor: colors.accent, justifyContent: 'center' }, avatarText: { ...typography.eyebrow, color: colors.black },
  badge: { alignSelf: 'flex-start', backgroundColor: colors.surfaceMuted, borderRadius: radii.pill, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs }, badgeText: { ...typography.eyebrow, color: colors.inkMuted, textTransform: 'uppercase' },
  badgeReward: { alignSelf: 'flex-start', backgroundColor: colors.accentSoft, borderRadius: radii.pill, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs }, badgeRewardText: { ...typography.eyebrow, color: colors.accent, textTransform: 'uppercase' },
  badgeSuccess: { alignSelf: 'flex-start', backgroundColor: colors.successSoft, borderRadius: radii.pill, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs }, badgeSuccessText: { ...typography.eyebrow, color: colors.success, textTransform: 'uppercase' },
  button: { alignItems: 'center', borderRadius: radii.md, borderWidth: 1, justifyContent: 'center', minHeight: control.button, paddingHorizontal: spacing.lg }, buttonText: { ...typography.captionStrong },
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.lg, borderWidth: 1, padding: spacing.lg },
  eyebrow: { ...typography.eyebrow, color: colors.primaryOnDark, textTransform: 'uppercase' },
  iconAction: { alignItems: 'center', backgroundColor: colors.surfaceMuted, borderColor: colors.border, borderRadius: radii.pill, borderWidth: 1, height: control.icon, justifyContent: 'center', width: control.icon },
  search: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.md, borderWidth: 1, flexDirection: 'row', gap: spacing.sm, minHeight: control.input, paddingLeft: spacing.md, paddingRight: spacing.xs }, searchInput: { ...typography.body, color: colors.ink, flex: 1, minHeight: control.input },
  sectionCopy: { flex: 1, gap: spacing.xxs }, sectionHeader: { alignItems: 'center', flexDirection: 'row', gap: spacing.md, justifyContent: 'space-between' }, sectionTitle: { ...typography.titleCompact, color: colors.ink },
});
