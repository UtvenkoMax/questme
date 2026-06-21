import { useEffect } from 'react';
import { StyleSheet, type ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  Easing,
  FadeIn,
  FadeOut,
  SlideInDown,
} from 'react-native-reanimated';

import { colors, radii, shadows, spacing } from '@/theme';

interface AnimatedCardProps {
  children: React.ReactNode;
  index?: number;
  delay?: number;
  style?: ViewStyle;
  onPress?: () => void;
}

/**
 * Card with staggered entrance animation.
 * Each card slides up and fades in with a delay based on index.
 */
export function AnimatedCard({ children, index = 0, delay = 60, style }: AnimatedCardProps) {
  const translateY = useSharedValue(30);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.97);

  useEffect(() => {
    const staggerDelay = index * delay;

    translateY.value = withDelay(
      staggerDelay,
      withSpring(0, { damping: 18, stiffness: 120 })
    );
    opacity.value = withDelay(
      staggerDelay,
      withTiming(1, { duration: 350, easing: Easing.out(Easing.cubic) })
    );
    scale.value = withDelay(
      staggerDelay,
      withSpring(1, { damping: 20, stiffness: 150 })
    );
  }, [index, delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[cardStyles.card, style, animatedStyle]}>
      {children}
    </Animated.View>
  );
}

/**
 * Pressable animated card with scale feedback
 */
export function AnimatedPressableCard({ children, index = 0, delay = 60, style, onPress }: AnimatedCardProps) {
  const pressed = useSharedValue(1);
  const translateY = useSharedValue(30);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const staggerDelay = index * delay;
    translateY.value = withDelay(staggerDelay, withSpring(0, { damping: 18, stiffness: 120 }));
    opacity.value = withDelay(
      staggerDelay,
      withTiming(1, { duration: 350, easing: Easing.out(Easing.cubic) })
    );
  }, [index, delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: pressed.value }],
    opacity: opacity.value,
  }));

  function handlePressIn() {
    pressed.value = withSpring(0.97, { damping: 15, stiffness: 200 });
  }

  function handlePressOut() {
    pressed.value = withSpring(1, { damping: 15, stiffness: 200 });
  }

  return (
    <Animated.View style={[cardStyles.card, style, animatedStyle]}>
      <Animated.View
        onTouchStart={handlePressIn}
        onTouchEnd={() => {
          handlePressOut();
          onPress?.();
        }}
        onTouchCancel={handlePressOut}
      >
        {children}
      </Animated.View>
    </Animated.View>
  );
}

/** Preset entering/exiting animations */
export const cardEntering = FadeIn.duration(300).springify();
export const cardExiting = FadeOut.duration(200);
export const cardSlideIn = SlideInDown.springify().damping(18).stiffness(120);

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.borderSoft,
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: spacing.md,
    ...shadows.card,
  },
});
