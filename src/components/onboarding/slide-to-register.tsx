import { useCallback, useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, Text, View, type LayoutChangeEvent } from 'react-native';
import { Pressable } from 'react-native';

import { onboardingStyles as s, THUMB_SIZE, TRACK_PADDING } from './onboarding.styles';

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
        inputRange: [0, Math.max(maxSlide, 1)],
        outputRange: [THUMB_SIZE, Math.max(trackWidth - TRACK_PADDING * 2, THUMB_SIZE)],
        extrapolate: 'clamp',
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [trackWidth]
  );

  const setVal = useCallback(
    (v: number) => {
      const next = Math.min(Math.max(v, 0), maxSlideRef.current);
      slideValueRef.current = next;
      slideX.setValue(next);
    },
    [slideX]
  );

  const reset = useCallback(() => {
    slideValueRef.current = 0;
    slideStartRef.current = 0;
    Animated.spring(slideX, { toValue: 0, speed: 18, bounciness: 6, useNativeDriver: false }).start();
  }, [slideX]);

  const complete = useCallback(() => {
    Animated.timing(slideX, { toValue: maxSlideRef.current, duration: 160, useNativeDriver: false }).start(onComplete);
  }, [onComplete, slideX]);

  const setValRef = useRef(setVal); setValRef.current = setVal;
  const resetRef = useRef(reset); resetRef.current = reset;
  const completeRef = useRef(complete); completeRef.current = complete;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 8 && Math.abs(g.dx) > Math.abs(g.dy),
      onPanResponderGrant: (e) => {
        slideX.stopAnimation((val) => {
          const touch = e.nativeEvent.locationX - THUMB_SIZE / 2 - TRACK_PADDING;
          slideStartRef.current = Math.min(Math.max(Math.max(val, touch), 0), maxSlideRef.current);
          setValRef.current(slideStartRef.current);
        });
      },
      onPanResponderMove: (_, g) => setValRef.current(slideStartRef.current + g.dx),
      onPanResponderRelease: () => {
        const ms = maxSlideRef.current;
        if (ms > 0 && slideValueRef.current >= ms * 0.78) { completeRef.current(); return; }
        resetRef.current();
      },
      onPanResponderTerminate: () => resetRef.current(),
    })
  ).current;

  return (
    <View style={s.finalActions}>
      <View
        {...panResponder.panHandlers}
        onLayout={(e: LayoutChangeEvent) => setTrackWidth(e.nativeEvent.layout.width)}
        style={[s.track, { borderColor: accent + '33' }]}
        accessibilityRole="button"
        accessibilityLabel="Провести для початку"
        accessibilityHint="Перетягніть повзунок вправо або натисніть кнопку створення профілю нижче"
      >
        <Animated.View style={[s.trackFill, { width: fillWidth, backgroundColor: accent + '22' }]} />
        <Text style={[s.trackText, { color: accent }]}>Проведіть для початку</Text>
        <Animated.View style={[s.thumb, { transform: [{ translateX: slideX }], backgroundColor: accent }]}>
          <Text style={s.thumbArrow}>→</Text>
        </Animated.View>
      </View>
      <Pressable
        accessibilityRole="button"
        hitSlop={8}
        onPress={onFallback}
        style={({ pressed }) => [s.fallbackButton, { borderColor: accent }, pressed && s.nextButtonPressed]}
      >
        <Text style={[s.fallbackButtonText, { color: accent }]}>Створити профіль</Text>
      </Pressable>
    </View>
  );
}
