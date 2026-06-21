import * as Haptics from 'expo-haptics';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { type Slide } from './slides-data';
import { SlideDots } from './slide-dots';
import { SlideToRegister } from './slide-to-register';
import { onboardingStyles as s } from './onboarding.styles';
import { INTEREST_OPTIONS, type InterestId } from '@/services/preferences-service';
import type { ResponsiveMetrics } from '@/utils/responsive';

type OnboardingPanelProps = {
  slide: Slide;
  currentIndex: number;
  isLastSlide: boolean;
  layout: ResponsiveMetrics;
  onNext: () => void;
  onComplete: () => void;
  onFallback: () => void;
  onToggleInterest: (interestId: InterestId) => void;
  screenWidth: number;
  selectedInterestIds: InterestId[];
};

export function OnboardingPanel({
  slide,
  currentIndex,
  isLastSlide,
  layout,
  onNext,
  onComplete,
  onFallback,
  onToggleInterest,
  screenWidth,
  selectedInterestIds,
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

        {isLastSlide ? (
          <View style={s.interestGrid}>
            {INTEREST_OPTIONS.map((interest) => {
              const selected = selectedInterestIds.includes(interest.id);
              return (
                <Pressable
                  accessibilityRole="button"
                  key={interest.id}
                  onPress={() => onToggleInterest(interest.id)}
                  style={[
                    s.interestChip,
                    { borderColor: selected ? slide.accent : undefined },
                    selected && { backgroundColor: slide.accent },
                  ]}>
                  <Text style={[s.interestChipText, selected && s.interestChipTextActive]}>
                    {interest.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ) : null}
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
          onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
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
