import { useEffect } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';

import { colors, radii, spacing } from '@/theme';

interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

/**
 * Skeleton shimmer component.
 * Shows a pulsing placeholder while content loads.
 */
export function Skeleton({ width = '100%', height = 16, borderRadius = radii.sm, style }: SkeletonProps) {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 1], [0.3, 0.7]),
  }));

  return (
    <Animated.View
      style={[
        {
          width: typeof width === 'number' ? width : undefined,
          height,
          borderRadius,
          backgroundColor: colors.border,
        },
        typeof width === 'string' && { width },
        style,
        animatedStyle,
      ]}
    />
  );
}

/** Skeleton card — mimics a quest card layout */
export function SkeletonCard() {
  return (
    <View style={skeletonStyles.card}>
      <Skeleton width="100%" height={140} borderRadius={radii.md} />
      <View style={skeletonStyles.body}>
        <Skeleton width="70%" height={18} />
        <Skeleton width="100%" height={14} style={skeletonStyles.gap} />
        <Skeleton width="40%" height={14} style={skeletonStyles.gap} />
      </View>
    </View>
  );
}

/** Skeleton list — multiple cards */
export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <View style={skeletonStyles.list}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </View>
  );
}

/** Skeleton text block */
export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <View style={skeletonStyles.textBlock}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          width={i === lines - 1 ? '60%' : '100%'}
          height={14}
          style={i > 0 ? skeletonStyles.gap : undefined}
        />
      ))}
    </View>
  );
}

/** Skeleton avatar */
export function SkeletonAvatar({ size = 48 }: { size?: number }) {
  return <Skeleton width={size} height={size} borderRadius={size / 2} />;
}

/** Skeleton row — icon + text */
export function SkeletonRow() {
  return (
    <View style={skeletonStyles.row}>
      <SkeletonAvatar size={40} />
      <View style={skeletonStyles.rowText}>
        <Skeleton width="60%" height={14} />
        <Skeleton width="40%" height={12} style={skeletonStyles.gapSm} />
      </View>
    </View>
  );
}

const skeletonStyles = StyleSheet.create({
  body: {
    gap: spacing.xxs,
    padding: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.borderSoft,
    borderRadius: radii.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  gap: {
    marginTop: spacing.xs,
  },
  gapSm: {
    marginTop: spacing.xxs,
  },
  list: {
    gap: spacing.md,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  rowText: {
    flex: 1,
    gap: spacing.xxs,
  },
  textBlock: {
    gap: spacing.xxs,
  },
});
