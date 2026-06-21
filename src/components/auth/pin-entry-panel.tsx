import * as Haptics from 'expo-haptics';
import React, { useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';

import { colors } from '@/theme';
import { PIN_DIGIT_ROWS } from './pin-code.types';
import { pinCodeStyles as styles } from './pin-code.styles';

type PinEntryPanelProps = {
  cancelLabel?: string;
  compact?: boolean;
  onCancel: () => void;
  onPressDigit: (digit: string) => void;
};

export function PinEntryPanel({
  cancelLabel = 'Очистити',
  compact = false,
  onCancel,
  onPressDigit,
}: PinEntryPanelProps) {
  return (
    <View style={styles.pinPanel}>
      <View style={[styles.keypad, compact && styles.keypadCompact]}>
        {PIN_DIGIT_ROWS.map((row) => (
          <View key={row.join('')} style={[styles.keypadRow, compact && styles.keypadRowCompact]}>
            {row.map((digit) => (
              <DigitKey compact={compact} digit={digit} key={digit} onPress={onPressDigit} />
            ))}
          </View>
        ))}

        <View style={[styles.keypadBottomRow, compact && styles.keypadBottomRowCompact]}>
          <View style={[styles.bottomSpacer, compact && styles.bottomSpacerCompact]} />
          <DigitKey compact={compact} digit="0" onPress={onPressDigit} />
          
          <Pressable
            accessibilityLabel={cancelLabel}
            accessibilityRole="button"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onCancel();
            }}
            style={({ pressed }) => [
              styles.cancelButton,
              compact && styles.cancelButtonCompact,
              pressed && styles.cancelButtonPressed,
            ]}
          >
            <Text style={styles.cancelText}>{cancelLabel}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

type DigitKeyProps = {
  compact: boolean;
  digit: string;
  onPress: (digit: string) => void;
};

function DigitKey({ compact, digit, onPress }: DigitKeyProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const backgroundColor = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 0.85,
        useNativeDriver: true,
        speed: 30,
        bounciness: 4,
      }),
      Animated.timing(backgroundColor, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      })
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 20,
        bounciness: 8,
      }),
      Animated.timing(backgroundColor, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      })
    ]).start();
  };

  const animatedBg = backgroundColor.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.surface, colors.primarySoft],
  });

  return (
    <Animated.View style={[{ transform: [{ scale }] }]}>
      <Pressable
        accessibilityLabel={`Цифра ${digit}`}
        accessibilityRole="button"
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => onPress(digit)}
      >
        <Animated.View style={[styles.key, compact && styles.keyCompact, { backgroundColor: animatedBg }]}>
          <Text style={[styles.keyText, compact && styles.keyTextCompact]}>{digit}</Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}
