import { useCallback } from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { colors, radii, spacing, typography, shadows } from '@/theme';

const SWIPE_THRESHOLD = 120;
const SNAP_BACK_CONFIG = { damping: 20, stiffness: 200 };

interface SwipeableQuestProps {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  onToggle: (id: string) => void;
  onDelete?: (id: string) => void;
  style?: ViewStyle;
}

/**
 * Swipeable quest card:
 * - Swipe right → toggle completion (green)
 * - Swipe left → delete (red)
 * - Spring snap-back on release
 * - Haptic feedback at threshold
 */
export function SwipeableQuest({
  id,
  title,
  description,
  points,
  completed,
  onToggle,
  onDelete,
  style,
}: SwipeableQuestProps) {
  const translateX = useSharedValue(0);
  const hapticFired = useSharedValue(false);

  const triggerHaptic = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  }, []);

  const handleToggle = useCallback(() => {
    onToggle(id);
  }, [id, onToggle]);

  const handleDelete = useCallback(() => {
    onDelete?.(id);
  }, [id, onDelete]);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-15, 15])
    .onUpdate((event) => {
      translateX.value = event.translationX;

      // Haptic at threshold
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD && !hapticFired.value) {
        hapticFired.value = true;
        runOnJS(triggerHaptic)();
      }
      if (Math.abs(event.translationX) < SWIPE_THRESHOLD) {
        hapticFired.value = false;
      }
    })
    .onEnd((event) => {
      if (event.translationX > SWIPE_THRESHOLD) {
        // Swipe right — complete
        runOnJS(handleToggle)();
      } else if (event.translationX < -SWIPE_THRESHOLD && onDelete) {
        // Swipe left — delete
        runOnJS(handleDelete)();
      }

      translateX.value = withSpring(0, SNAP_BACK_CONFIG);
      hapticFired.value = false;
    });

  // Card slide animation
  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  // Right action (complete) — revealed when swiping right
  const rightActionStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, SWIPE_THRESHOLD], [0, 1], Extrapolation.CLAMP),
    transform: [
      {
        scale: interpolate(translateX.value, [0, SWIPE_THRESHOLD], [0.6, 1], Extrapolation.CLAMP),
      },
    ],
  }));

  // Left action (delete) — revealed when swiping left
  const leftActionStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, -SWIPE_THRESHOLD], [0, 1], Extrapolation.CLAMP),
    transform: [
      {
        scale: interpolate(translateX.value, [0, -SWIPE_THRESHOLD], [0.6, 1], Extrapolation.CLAMP),
      },
    ],
  }));

  return (
    <View style={[swipeStyles.wrapper, style]}>
      {/* Background actions */}
      <View style={swipeStyles.actionsContainer}>
        {/* Left side — complete action */}
        <Animated.View style={[swipeStyles.actionLeft, rightActionStyle]}>
          <Feather name={completed ? 'rotate-ccw' : 'check'} size={24} color={colors.white} />
          <Text style={swipeStyles.actionText}>
            {completed ? 'Скасувати' : 'Готово'}
          </Text>
        </Animated.View>

        {/* Right side — delete action */}
        {onDelete && (
          <Animated.View style={[swipeStyles.actionRight, leftActionStyle]}>
            <Feather name="trash-2" size={24} color={colors.white} />
            <Text style={swipeStyles.actionText}>Видалити</Text>
          </Animated.View>
        )}
      </View>

      {/* Foreground card */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[swipeStyles.card, cardStyle]}>
          <View style={swipeStyles.header}>
            <View style={[swipeStyles.status, completed && swipeStyles.statusCompleted]}>
              {completed && <Feather name="check" size={12} color={colors.white} />}
            </View>
            <View style={swipeStyles.content}>
              <Text
                style={[swipeStyles.title, completed && swipeStyles.titleCompleted]}
                numberOfLines={1}
              >
                {title}
              </Text>
              <Text style={swipeStyles.description} numberOfLines={2}>
                {description}
              </Text>
            </View>
            <View style={swipeStyles.pointsBadge}>
              <Feather name="zap" size={12} color={colors.warning} />
              <Text style={swipeStyles.pointsText}>{points}</Text>
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const swipeStyles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
    borderRadius: radii.lg,
  },
  actionsContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: radii.lg,
  },
  actionLeft: {
    alignItems: 'center',
    backgroundColor: colors.success,
    borderRadius: radii.lg,
    flex: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    height: '100%',
    justifyContent: 'flex-start',
    paddingLeft: spacing.lg,
  },
  actionRight: {
    alignItems: 'center',
    backgroundColor: colors.danger,
    borderRadius: radii.lg,
    flex: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    height: '100%',
    justifyContent: 'flex-end',
    paddingRight: spacing.lg,
  },
  actionText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.borderSoft,
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: spacing.md,
    ...shadows.card,
  },
  content: {
    flex: 1,
    gap: spacing.xxs,
  },
  description: {
    ...typography.caption,
    color: colors.inkSubtle,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  pointsBadge: {
    alignItems: 'center',
    backgroundColor: colors.warningSoft,
    borderRadius: radii.pill,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxs,
  },
  pointsText: {
    ...typography.captionStrong,
    color: colors.warning,
    fontSize: 13,
  },
  status: {
    backgroundColor: colors.border,
    borderRadius: 10,
    height: 20,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusCompleted: {
    backgroundColor: colors.success,
  },
  title: {
    ...typography.label,
    color: colors.ink,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.inkSubtle,
  },
});
