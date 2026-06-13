import { useRouter } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  Text,
  View,
  type LayoutChangeEvent,
} from 'react-native';

import { startScreenStyles as styles } from './start-screen.styles';

const THUMB_SIZE = 56;
const TRACK_PADDING = 4;

export function SlideToRegister() {
  const router = useRouter();
  const [slideX] = useState(() => new Animated.Value(0));
  const [trackWidth, setTrackWidth] = useState(0);
  const slideStart = useRef(0);
  const slideValue = useRef(0);
  const maxSlide = Math.max(trackWidth - THUMB_SIZE - TRACK_PADDING * 2, 0);
  const animationRange = Math.max(maxSlide, 1);
  const fillWidth = slideX.interpolate({
    inputRange: [0, animationRange],
    outputRange: [THUMB_SIZE, Math.max(trackWidth - TRACK_PADDING * 2, THUMB_SIZE)],
    extrapolate: 'clamp',
  });

  const setSlideValue = useCallback(
    (value: number) => {
      const nextValue = Math.min(Math.max(value, 0), maxSlide);
      slideValue.current = nextValue;
      slideX.setValue(nextValue);
    },
    [maxSlide, slideX]
  );

  const completeSlide = useCallback(() => {
    slideValue.current = maxSlide;
    Animated.timing(slideX, {
      toValue: maxSlide,
      duration: 160,
      useNativeDriver: false,
    }).start(() => router.push('/register'));
  }, [maxSlide, router, slideX]);

  const resetSlide = useCallback(() => {
    slideValue.current = 0;
    slideStart.current = 0;
    Animated.spring(slideX, {
      toValue: 0,
      speed: 18,
      bounciness: 6,
      useNativeDriver: false,
    }).start();
  }, [slideX]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dx) > 8 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy),
        onPanResponderGrant: (event) => {
          const touchLocationX = event.nativeEvent.locationX;

          slideX.stopAnimation((value) => {
            const touchValue = touchLocationX - THUMB_SIZE / 2 - TRACK_PADDING;
            const nextValue = Math.max(value, touchValue);
            slideStart.current = Math.min(Math.max(nextValue, 0), maxSlide);
            setSlideValue(slideStart.current);
          });
        },
        onPanResponderMove: (_, gestureState) => {
          setSlideValue(slideStart.current + gestureState.dx);
        },
        onPanResponderRelease: () => {
          if (maxSlide > 0 && slideValue.current >= maxSlide * 0.78) {
            completeSlide();
            return;
          }
          resetSlide();
        },
        onPanResponderTerminate: resetSlide,
      }),
    [completeSlide, maxSlide, resetSlide, setSlideValue, slideX]
  );

  const handleLayout = (event: LayoutChangeEvent) => {
    setTrackWidth(event.nativeEvent.layout.width);
  };

  return (
    <View
      accessibilityHint="Проведіть вправо або скористайтесь кнопкою створення профілю нижче."
      accessibilityLabel="Провести для реєстрації"
      accessibilityRole="button"
      style={styles.trackWrap}>
      <View {...panResponder.panHandlers} onLayout={handleLayout} style={styles.track}>
        <Animated.View style={[styles.trackFill, { width: fillWidth }]} />
        <Text style={styles.trackText}>Проведіть для реєстрації</Text>
        <Animated.View style={[styles.thumb, { transform: [{ translateX: slideX }] }]}>
          <Text style={styles.thumbText}>→</Text>
        </Animated.View>
      </View>
    </View>
  );
}
