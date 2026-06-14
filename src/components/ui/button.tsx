import { Feather } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { colors, hitSlop, radii, spacing } from '@/theme';

type IconName = React.ComponentProps<typeof Feather>['name'];
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  children?: ReactNode;
  fullWidth?: boolean;
  icon?: IconName;
  loading?: boolean;
  size?: ButtonSize;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  title?: string;
  variant?: ButtonVariant;
};

const textColorByVariant: Record<ButtonVariant, string> = {
  danger: colors.danger,
  ghost: colors.inkMuted,
  primary: colors.white,
  secondary: colors.primary,
  success: colors.success,
};

export function Button({
  children,
  disabled,
  fullWidth = true,
  icon,
  loading = false,
  size = 'lg',
  style,
  textStyle,
  title,
  variant = 'primary',
  ...pressableProps
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const iconColor = isDisabled ? colors.inkSubtle : textColorByVariant[variant];

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      hitSlop={hitSlop.sm}
      style={({ pressed }) => [
        styles.base,
        styles[size],
        styles[variant],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
      {...pressableProps}>
      {loading ? <ActivityIndicator color={iconColor} size="small" /> : null}
      {!loading && icon ? <Feather color={iconColor} name={icon} size={size === 'sm' ? 16 : 18} /> : null}
      {children ?? <Text style={[styles.text, { color: iconColor }, textStyle]}>{title}</Text>}
    </Pressable>
  );
}

type IconButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  accessibilityLabel: string;
  icon: IconName;
  selected?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function IconButton({ accessibilityLabel, disabled, icon, selected = false, style, ...pressableProps }: IconButtonProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      disabled={disabled}
      hitSlop={hitSlop.md}
      style={({ pressed }) => [
        styles.iconButton,
        selected && styles.iconButtonSelected,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
      {...pressableProps}>
      <Feather color={selected ? colors.white : colors.primary} name={icon} size={20} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  sm: {
    minHeight: 40,
    paddingHorizontal: spacing.md,
  },
  md: {
    minHeight: 48,
  },
  lg: {
    minHeight: 54,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  primary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primarySoft,
  },
  ghost: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  danger: {
    backgroundColor: colors.dangerSoft,
    borderColor: colors.dangerSoft,
  },
  success: {
    backgroundColor: colors.successSoft,
    borderColor: colors.successSoft,
  },
  disabled: {
    opacity: 0.52,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
  text: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0,
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  iconButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
});
