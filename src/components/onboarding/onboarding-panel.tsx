import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { type Slide } from './slides-data';
import { SlideDots } from './slide-dots';
import { SlideToRegister } from './slide-to-register';
import { onboardingStyles as s } from './onboarding.styles';
import type { ResponsiveMetrics } from '@/utils/responsive';

type OnboardingPanelProps = {
  slide: Slide;
  currentIndex: number;
  isLastSlide: boolean;
  layout: ResponsiveMetrics;
  onNext: () => void;
  onComplete: () => void;
  onFallback: () => void;
  screenWidth: number;
};

export function OnboardingPanel({
  slide,
  currentIndex,
  isLastSlide,
  layout,
  onNext,
  onComplete,
  onFallback,
  screenWidth,
}: OnboardingPanelProps) {
  const sideInset = layout.isWide ? Math.max((screenWidth - layout.contentMaxWidth) / 2, layout.gutter) : 0;
  const compact = layout.isCompactHeight || layout.isCompactWidth;

  return (
    <SafeAreaView
      edges={['bottom']}
      pointerEvents="box-none"
      style={[
        s.panel,
        compact && s.panelCompact,
        {
          left: sideInset,
          paddingHorizontal: layout.gutter,
          right: sideInset,
        },
      ]}
    >
      <View pointerEvents="none">
        <View style={[s.accentLine, { backgroundColor: slide.accent }]} />

        <Text style={[s.title, compact && s.titleCompact]}>{slide.title}</Text>
        <Text style={[s.subtitle, compact && s.subtitleCompact]}>{slide.subtitle}</Text>

        <SlideDots currentIndex={currentIndex} accent={slide.accent} />
      </View>

      {isLastSlide ? (
        <SlideToRegister
          accent={slide.accent}
          onComplete={onComplete}
          onFallback={onFallback}
        />
      ) : (
        <Pressable
          accessibilityLabel="Перейти до наступного слайда"
          accessibilityRole="button"
          hitSlop={8}
          onPress={onNext}
          style={({ pressed }) => [
            s.nextButton,
            compact && s.nextButtonCompact,
            { backgroundColor: slide.accent },
            pressed && s.nextButtonPressed,
          ]}
        >
          <Text style={s.nextButtonText}>Далі →</Text>
        </Pressable>
      )}
    </SafeAreaView>
  );
}
