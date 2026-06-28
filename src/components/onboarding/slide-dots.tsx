import { View } from 'react-native';

import { SLIDES } from './slides-data';
import { onboardingStyles as s } from './onboarding.styles';

type SlideDotProps = {
  currentIndex: number;
  accent: string;
};

export function SlideDots({ currentIndex, accent }: SlideDotProps) {
  return (
    <View style={s.dots}>
      {SLIDES.map((_, i) => (
        <View
          key={i}
          style={[
            s.dot,
            i === currentIndex
              ? [s.dotActive, { backgroundColor: accent }]
              : s.dotInactive,
          ]}
        />
      ))}
    </View>
  );
}
