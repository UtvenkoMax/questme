import { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';

import { colors, typography } from '@/theme';

interface AnimatedProgressRingProps {
  /** Progress from 0 to 100 */
  progress: number;
  /** Ring size in pixels */
  size?: number;
  /** Stroke width */
  strokeWidth?: number;
  /** Active color */
  activeColor?: string;
  /** Track color */
  trackColor?: string;
  /** Whether to show percentage label */
  showLabel?: boolean;
  /** Custom center content */
  children?: React.ReactNode;
  /** Duration in ms */
  duration?: number;
}

/**
 * Animated circular progress indicator using View-based approach.
 * Uses two half-circles rotating to create progress effect.
 */
export function AnimatedProgressRing({
  progress,
  size = 100,
  strokeWidth = 8,
  activeColor = colors.primary,
  trackColor = colors.borderSoft,
  showLabel = true,
  children,
  duration = 800,
}: AnimatedProgressRingProps) {
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    const clamped = Math.max(0, Math.min(100, progress));
    animatedProgress.value = withSpring(clamped, {
      damping: 20,
      stiffness: 80,
      mass: 1,
    });
  }, [progress]);

  const halfSize = size / 2;
  const innerSize = size - strokeWidth * 2;

  // Left half rotation (0-50%)
  const leftStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      animatedProgress.value,
      [0, 50, 100],
      [-180, 0, 0]
    );
    return { transform: [{ rotateZ: `${rotate}deg` }] };
  });

  // Right half rotation (50-100%)
  const rightStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      animatedProgress.value,
      [0, 50, 100],
      [-180, -180, 0]
    );
    return { transform: [{ rotateZ: `${rotate}deg` }] };
  });

  // Label fade-in
  const labelOpacity = useAnimatedStyle(() => ({
    opacity: withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) }),
  }));

  return (
    <View style={[ringStyles.container, { width: size, height: size }]}>
      {/* Track circle */}
      <View
        style={[
          ringStyles.track,
          {
            width: size,
            height: size,
            borderRadius: halfSize,
            borderWidth: strokeWidth,
            borderColor: trackColor,
          },
        ]}
      />

      {/* Left half */}
      <View style={[ringStyles.halfContainer, { width: halfSize, height: size, left: 0 }]}>
        <Animated.View
          style={[
            ringStyles.half,
            {
              width: halfSize,
              height: size,
              borderTopLeftRadius: halfSize,
              borderBottomLeftRadius: halfSize,
              borderWidth: strokeWidth,
              borderRightWidth: 0,
              borderColor: activeColor,
            },
            leftStyle,
          ]}
        />
      </View>

      {/* Right half */}
      <View style={[ringStyles.halfContainer, { width: halfSize, height: size, right: 0 }]}>
        <Animated.View
          style={[
            ringStyles.half,
            {
              width: halfSize,
              height: size,
              borderTopRightRadius: halfSize,
              borderBottomRightRadius: halfSize,
              borderWidth: strokeWidth,
              borderLeftWidth: 0,
              borderColor: activeColor,
            },
            rightStyle,
          ]}
        />
      </View>

      {/* Inner circle (background) */}
      <View
        style={[
          ringStyles.inner,
          {
            width: innerSize,
            height: innerSize,
            borderRadius: innerSize / 2,
          },
        ]}
      />

      {/* Center label */}
      <Animated.View style={[ringStyles.labelContainer, labelOpacity]}>
        {children ?? (
          showLabel && (
            <Text style={[ringStyles.label, { color: activeColor }]}>
              {Math.round(progress)}%
            </Text>
          )
        )}
      </Animated.View>
    </View>
  );
}

/**
 * XP level ring — shows level in center, XP progress around
 */
export function XpLevelRing({
  level,
  xpProgress,
  size = 80,
}: {
  level: number;
  xpProgress: number;
  size?: number;
}) {
  return (
    <AnimatedProgressRing
      progress={xpProgress}
      size={size}
      strokeWidth={6}
      activeColor={colors.primary}
    >
      <View style={ringStyles.levelCenter}>
        <Text style={ringStyles.levelNumber}>{level}</Text>
        <Text style={ringStyles.levelLabel}>LVL</Text>
      </View>
    </AnimatedProgressRing>
  );
}

/**
 * Simple animated progress bar
 */
export function AnimatedProgressBar({
  progress,
  height = 6,
  activeColor = colors.primary,
  trackColor = colors.borderSoft,
}: {
  progress: number;
  height?: number;
  activeColor?: string;
  trackColor?: string;
}) {
  const animatedWidth = useSharedValue(0);

  useEffect(() => {
    animatedWidth.value = withSpring(Math.max(0, Math.min(100, progress)), {
      damping: 20,
      stiffness: 100,
    });
  }, [progress]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${animatedWidth.value}%`,
  }));

  return (
    <View style={[ringStyles.barTrack, { height, backgroundColor: trackColor, borderRadius: height / 2 }]}>
      <Animated.View
        style={[
          ringStyles.barFill,
          { height, backgroundColor: activeColor, borderRadius: height / 2 },
          barStyle,
        ]}
      />
    </View>
  );
}

const ringStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  track: {
    position: 'absolute',
  },
  halfContainer: {
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
  },
  half: {
    position: 'absolute',
    top: 0,
  },
  inner: {
    backgroundColor: colors.surface,
    position: 'absolute',
  },
  labelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  label: {
    ...typography.captionStrong,
    fontSize: 16,
    fontWeight: '700',
  },
  levelCenter: {
    alignItems: 'center',
  },
  levelLabel: {
    ...typography.nav,
    color: colors.inkSubtle,
    fontSize: 9,
    letterSpacing: 1,
  },
  levelNumber: {
    ...typography.captionStrong,
    color: colors.ink,
    fontSize: 22,
    fontWeight: '700',
  },
  barTrack: {
    overflow: 'hidden',
    width: '100%',
  },
  barFill: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
});
