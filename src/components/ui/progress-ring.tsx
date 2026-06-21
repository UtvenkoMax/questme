import { useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { colors, radii, spacing, typography } from '@/theme';

type ProgressRingProps = {
  label: string;
  percent: number;
  size?: number;
  value: string;
};

export function ProgressRing({ label, percent, size = 112, value }: ProgressRingProps) {
  const clampedPercent = Math.min(Math.max(percent, 0), 100);
  const progress = useSharedValue(0);
  const ringSize = size;
  const stroke = Math.max(Math.round(size * 0.09), 8);
  const animatedFillStyle = useAnimatedStyle(() => ({
    opacity: progress.value / 100,
    transform: [{ rotate: `${progress.value * 1.8}deg` }],
  }));

  useEffect(() => {
    progress.value = withTiming(clampedPercent, {
      duration: 720,
      easing: Easing.out(Easing.cubic),
    });
  }, [clampedPercent, progress]);

  return (
    <View style={styles.wrap}>
      <View
        style={[
          styles.ring,
          {
            borderWidth: stroke,
            height: ringSize,
            width: ringSize,
          },
        ]}>
        <Animated.View
          style={[
            styles.fillHint,
            animatedFillStyle,
          ]}
        />
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fillHint: {
    backgroundColor: colors.primarySoft,
    borderRadius: radii.pill,
    bottom: spacing.xs,
    left: spacing.xs,
    position: 'absolute',
    right: spacing.xs,
    top: spacing.xs,
  },
  label: {
    ...typography.caption,
    color: colors.inkSubtle,
    textAlign: 'center',
  },
  ring: {
    alignItems: 'center',
    borderColor: colors.primary,
    borderRadius: radii.pill,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  value: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 29,
    textAlign: 'center',
  },
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
