import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { type Slide } from './slides-data';
import { SlideDots } from './slide-dots';
import { SlideToRegister } from './slide-to-register';
import { onboardingStyles as s } from './onboarding.styles';

type OnboardingPanelProps = {
  slide: Slide;
  currentIndex: number;
  isLastSlide: boolean;
  onNext: () => void;
  onComplete: () => void;
  onFallback: () => void;
};

export function OnboardingPanel({
  slide,
  currentIndex,
  isLastSlide,
  onNext,
  onComplete,
  onFallback,
}: OnboardingPanelProps) {
  return (
    <SafeAreaView edges={['bottom']} style={s.panel}>
      <View style={[s.accentLine, { backgroundColor: slide.accent }]} />

      <Text style={s.title}>{slide.title}</Text>
      <Text style={s.subtitle}>{slide.subtitle}</Text>

      <SlideDots currentIndex={currentIndex} accent={slide.accent} />

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
