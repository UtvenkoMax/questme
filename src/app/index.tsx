import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { FlatList, View, useWindowDimensions } from 'react-native';

import { OnboardingPanel } from '@/components/onboarding/onboarding-panel';
import { SlideItem } from '@/components/onboarding/slide-item';
import { SLIDES } from '@/components/onboarding/slides-data';
import { onboardingStyles as s } from '@/components/onboarding/onboarding.styles';

export default function OnboardingScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);

  const isLastSlide = currentIndex === SLIDES.length - 1;
  const currentSlide = SLIDES[currentIndex];

  const goToNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleComplete = () => router.push('/register');
  const handleFallback = () => router.push('/register');

  return (
    <View style={[s.screen, { backgroundColor: currentSlide.bgFrom }]}>
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        extraData={width}
        style={s.slideList}
        getItemLayout={(_, index) => ({
          index,
          length: width,
          offset: width * index,
        })}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(Math.min(Math.max(idx, 0), SLIDES.length - 1));
        }}
        renderItem={({ item }) => <SlideItem item={item} width={width} />}
      />

      <OnboardingPanel
        slide={currentSlide}
        currentIndex={currentIndex}
        isLastSlide={isLastSlide}
        onNext={goToNext}
        onComplete={handleComplete}
        onFallback={handleFallback}
      />
    </View>
  );
}
