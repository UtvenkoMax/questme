import { useCallback, useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, Text, View, type LayoutChangeEvent } from 'react-native';

import { onboardingStyles as styles, THUMB_SIZE, TRACK_PADDING } from './onboarding.styles';

type SlideToRegisterProps = {
  accent: string;
  onComplete: () => void;
  onFallback: () => void;
};

export function SlideToRegister({ accent, onComplete, onFallback }: SlideToRegisterProps) {
  const [trackWidth, setTrackWidth] = useState(0);
  const [slideX] = useState(() => new Animated.Value(0));
  const slideStartRef = useRef(0);
  const slideValueRef = useRef(0);
  const maxSlideRef = useRef(0);

  const maxSlide = Math.max(trackWidth - THUMB_SIZE - TRACK_PADDING * 2, 0);
  maxSlideRef.current = maxSlide;

  const fillWidth = useMemo(
    () =>
      slideX.interpolate({
        extrapolate: 'clamp',
        inputRange: [0, Math.max(maxSlide, 1)],
        outputRange: [THUMB_SIZE, Math.max(trackWidth - TRACK_PADDING * 2, THUMB_SIZE)],
      }),
    [maxSlide, slideX, trackWidth]
  );

  const setSlideValue = useCallback(
    (value: number) => {
      const nextValue = Math.min(Math.max(value, 0), maxSlideRef.current);
      slideValueRef.current = nextValue;
      slideX.setValue(nextValue);
    },
    [slideX]
  );

  const reset = useCallback(() => {
    slideStartRef.current = 0;
    slideValueRef.current = 0;
    Animated.spring(slideX, {
      bounciness: 6,
      speed: 18,
      toValue: 0,
      useNativeDriver: false,
    }).start();
  }, [slideX]);

  const complete = useCallback(() => {
    Animated.timing(slideX, {
      duration: 160,
      toValue: maxSlideRef.current,
      useNativeDriver: false,
    }).start(onComplete);
  }, [onComplete, slideX]);

  const callbacksRef = useRef({ complete, reset, setSlideValue });
  callbacksRef.current = { complete, reset, setSlideValue };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dx) > 8 && Math.abs(gesture.dx) > Math.abs(gesture.dy),
      onPanResponderGrant: (event) => {
        slideX.stopAnimation((value) => {
          const touchValue = event.nativeEvent.locationX - THUMB_SIZE / 2 - TRACK_PADDING;
          slideStartRef.current = Math.min(Math.max(Math.max(value, touchValue), 0), maxSlideRef.current);
          callbacksRef.current.setSlideValue(slideStartRef.current);
        });
      },
      onPanResponderMove: (_, gesture) => {
        callbacksRef.current.setSlideValue(slideStartRef.current + gesture.dx);
      },
      onPanResponderRelease: () => {
        const max = maxSlideRef.current;
        if (max > 0 && slideValueRef.current >= max * 0.78) {
          callbacksRef.current.complete();
          return;
        }

        callbacksRef.current.reset();
      },
      onPanResponderTerminate: () => callbacksRef.current.reset(),
      onStartShouldSetPanResponder: () => true,
    })
  ).current;

  const handleLayout = (event: LayoutChangeEvent) => {
    setTrackWidth(event.nativeEvent.layout.width);
  };

  return (
    <View style={styles.finalActions}>
      <View
        {...panResponder.panHandlers}
        accessibilityHint="Перетягніть повзунок вправо або натисніть кнопку нижче"
        accessibilityLabel="Провести для початку"
        accessibilityRole="button"
        onLayout={handleLayout}
        style={[styles.track, { borderColor: `${accent}33` }]}>
        <Animated.View style={[styles.trackFill, { backgroundColor: `${accent}22`, width: fillWidth }]} />
        <Text style={[styles.trackText, { color: accent }]}>Проведіть для початку</Text>
        <Animated.View style={[styles.thumb, { backgroundColor: accent, transform: [{ translateX: slideX }] }]}>
          <Text style={styles.thumbArrow}>→</Text>
        </Animated.View>
      </View>
    </View>
  );
}
