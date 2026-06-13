import { Image } from 'expo-image';
import { View } from 'react-native';

import { type Slide } from './slides-data';
import { onboardingStyles as s } from './onboarding.styles';

type SlideItemProps = {
  item: Slide;
  width: number;
};

export function SlideItem({ item, width }: SlideItemProps) {
  return (
    <View style={[s.slide, { backgroundColor: item.bgFrom, width }]}>
      <View style={s.imageWrap}>
        <Image source={item.image} style={s.illustration} contentFit="contain" />
      </View>
    </View>
  );
}
