import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  Text,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { colors, hitSlop } from '@/theme';
import { styles } from './styles';

type IconName = React.ComponentProps<typeof Feather>['name'];
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  children?: React.ReactNode;
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
  
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const handlePressIn = (e: any) => {
    if (!isDisabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 0.95,
          useNativeDriver: true,
          speed: 20,
          bounciness: 4,
        }),
        Animated.timing(opacity, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        })
      ]).start();
    }
    pressableProps.onPressIn?.(e);
  };

  const handlePressOut = (e: any) => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 20,
        bounciness: 4,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      })
    ]).start();
    pressableProps.onPressOut?.(e);
  };

  return (
    <Animated.View style={[{ transform: [{ scale }], opacity: opacity }, fullWidth && styles.fullWidth, style]}>
      <Pressable
        accessibilityRole="button"
        disabled={isDisabled}
        hitSlop={hitSlop.sm}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.base,
          styles[size],
          styles[variant],
          isDisabled && styles.disabled,
        ]}
        {...pressableProps}>
        {loading ? <ActivityIndicator color={iconColor} size="small" /> : null}
        {!loading && icon ? <Feather color={iconColor} name={icon} size={size === 'sm' ? 16 : 18} /> : null}
        {children ?? <Text style={[styles.text, { color: iconColor }, textStyle]}>{title}</Text>}
      </Pressable>
    </Animated.View>
  );
}
