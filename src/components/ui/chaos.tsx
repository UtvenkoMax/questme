import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight } from 'phosphor-react-native';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { gradients, questColors } from '@/constants/colors';
import { radii, spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import type { AvatarPhotoSource } from '@/constants/avatarPhotos';

type ChaosButtonProps = {
  label: string;
  onPress?: () => void;
  icon?: ReactNode;
  variant?: 'ember' | 'electric' | 'outline' | 'ghost';
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

export function ChaosButton({ disabled = false, icon, label, onPress, style, variant = 'ember' }: ChaosButtonProps) {
  const content = (
    <>
      <Text style={[styles.buttonText, variant === 'outline' && styles.outlineButtonText]}>{label}</Text>
      {icon ?? <ArrowRight color={variant === 'outline' ? questColors.textPrimary : questColors.void} size={18} weight="bold" />}
    </>
  );

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={() => {
        if (disabled) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        onPress?.();
      }}
      style={({ pressed }) => [styles.buttonFrame, disabled && styles.disabled, pressed && styles.pressed, style]}>
      {variant === 'ember' ? (
        <LinearGradient colors={gradients.emberCta} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.button}>
          {content}
        </LinearGradient>
      ) : (
        <View
          style={[
            styles.button,
            variant === 'electric' && styles.electricButton,
            variant === 'outline' && styles.outlineButton,
            variant === 'ghost' && styles.ghostButton,
          ]}>
          {content}
        </View>
      )}
    </Pressable>
  );
}

export function ChaosBadge({
  children,
  tone = 'electric',
}: {
  children: ReactNode;
  tone?: 'electric' | 'acid' | 'ember' | 'muted' | 'success';
}) {
  return (
    <View style={[styles.badge, styles[`${tone}Badge`]]}>
      <Text style={[styles.badgeText, tone === 'acid' && styles.acidBadgeText]}>{children}</Text>
    </View>
  );
}

export function ChaosAvatar({
  emoji,
  label,
  size = 42,
  source,
}: {
  emoji?: string;
  label: string;
  size?: number;
  source?: AvatarPhotoSource | { uri: string };
}) {
  return (
    <View style={[styles.avatar, { height: size, width: size }]}>
      {source ? (
        <Image contentFit="cover" source={source} style={styles.avatarImage} />
      ) : emoji ? (
        <Text style={{ fontSize: Math.max(18, size * 0.48) }}>{emoji}</Text>
      ) : (
        <Text style={styles.avatarText}>{label.slice(0, 2).toUpperCase()}</Text>
      )}
    </View>
  );
}

export function ProgressLine({ percent, tone = 'electric' }: { percent: number; tone?: 'electric' | 'acid' | 'ember' | 'success' }) {
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, styles[`${tone}Progress`], { width: `${Math.min(Math.max(percent, 0), 100)}%` }]} />
    </View>
  );
}

export function SectionKicker({ title, eyebrow, action }: { title: string; eyebrow?: string; action?: ReactNode }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionCopy}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {action}
    </View>
  );
}

export function StatPill({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={styles.statPill}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  acidBadge: {
    backgroundColor: 'rgba(196, 255, 0, 0.16)',
    borderColor: 'rgba(196, 255, 0, 0.4)',
  },
  acidBadgeText: {
    color: questColors.acid,
  },
  acidProgress: {
    backgroundColor: questColors.acid,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: questColors.surfaceUp,
    borderColor: questColors.electric,
    borderRadius: radii.pill,
    borderWidth: 1,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    height: '100%',
    width: '100%',
  },
  avatarText: {
    ...typography.label,
    color: questColors.textPrimary,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radii.xs,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
  },
  badgeText: {
    ...typography.eyebrow,
    color: questColors.textPrimary,
    textTransform: 'uppercase',
  },
  button: {
    alignItems: 'center',
    borderRadius: radii.xs,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    minHeight: 50,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  buttonFrame: {
    borderRadius: radii.xs,
  },
  buttonText: {
    ...typography.label,
    color: questColors.void,
    textTransform: 'uppercase',
  },
  electricBadge: {
    backgroundColor: 'rgba(124, 58, 255, 0.16)',
    borderColor: 'rgba(124, 58, 255, 0.48)',
  },
  electricButton: {
    backgroundColor: questColors.electric,
  },
  electricProgress: {
    backgroundColor: questColors.electric,
  },
  disabled: {
    opacity: 0.44,
  },
  emberBadge: {
    backgroundColor: 'rgba(255, 77, 28, 0.16)',
    borderColor: 'rgba(255, 77, 28, 0.48)',
  },
  emberProgress: {
    backgroundColor: questColors.ember,
  },
  eyebrow: {
    ...typography.eyebrow,
    color: questColors.acid,
    textTransform: 'uppercase',
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  mutedBadge: {
    backgroundColor: questColors.surfaceUp,
    borderColor: questColors.border,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderColor: questColors.border,
    borderWidth: 1,
  },
  outlineButtonText: {
    color: questColors.textPrimary,
  },
  pressed: {
    opacity: 0.76,
    transform: [{ scale: 0.98 }],
  },
  progressFill: {
    borderRadius: radii.pill,
    height: '100%',
  },
  progressTrack: {
    backgroundColor: '#262638',
    borderRadius: radii.pill,
    height: 7,
    overflow: 'hidden',
    width: '100%',
  },
  sectionCopy: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  sectionTitle: {
    ...typography.titleCompact,
    color: questColors.textPrimary,
  },
  statLabel: {
    ...typography.eyebrow,
    color: questColors.textSecondary,
    textTransform: 'uppercase',
  },
  statPill: {
    backgroundColor: questColors.surfaceUp,
    borderColor: questColors.border,
    borderRadius: radii.sm,
    borderWidth: 1,
    flex: 1,
    gap: spacing.xxs,
    minWidth: 96,
    padding: spacing.md,
  },
  statValue: {
    ...typography.titleCompact,
    color: questColors.textPrimary,
  },
  successBadge: {
    backgroundColor: 'rgba(36, 209, 139, 0.14)',
    borderColor: 'rgba(36, 209, 139, 0.4)',
  },
  successProgress: {
    backgroundColor: questColors.success,
  },
});
