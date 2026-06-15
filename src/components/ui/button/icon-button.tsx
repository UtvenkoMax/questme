import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useRef } from 'react';
import {
  Animated,
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors, hitSlop } from '@/theme';
import { styles } from './styles';

type IconName = React.ComponentProps<typeof Feather>['name'];

export type IconButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  accessibilityLabel: string;
  icon: IconName;
  selected?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function IconButton({ accessibilityLabel, disabled, icon, selected = false, style, ...pressableProps }: IconButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = (e: any) => {
    if (!disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      Animated.spring(scale, {
        toValue: 0.9,
        useNativeDriver: true,
        speed: 20,
        bounciness: 8,
      }).start();
    }
    pressableProps.onPressIn?.(e);
  };

  const handlePressOut = (e: any) => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 8,
    }).start();
    pressableProps.onPressOut?.(e);
  };

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        disabled={disabled}
        hitSlop={hitSlop.md}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.iconButton,
          selected && styles.iconButtonSelected,
          disabled && styles.disabled,
        ]}
        {...pressableProps}>
        <Feather color={selected ? colors.white : colors.primary} name={icon} size={20} />
      </Pressable>
    </Animated.View>
  );
}
