import { useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { FlatList, View, useWindowDimensions } from 'react-native';

import { OnboardingPanel } from '@/components/onboarding/onboarding-panel';
import { SlideItem } from '@/components/onboarding/slide-item';
import { SLIDES } from '@/components/onboarding/slides-data';
import { onboardingStyles as styles } from '@/components/onboarding/onboarding.styles';
import { useAppPreferences } from '@/components/providers/app-preferences';
import { setOnboardingSeen } from '@/services/auth-service';
import { DEFAULT_PREFERENCES, type InterestId } from '@/services/preferences-service';
import { getResponsiveMetrics } from '@/utils/responsive';

export default function OnboardingScreen() {
  const router = useRouter();
  const { updatePreferences } = useAppPreferences();
  const flatListRef = useRef<FlatList>(null);
  const { height, width } = useWindowDimensions();
  const layout = useMemo(() => getResponsiveMetrics(width, height), [height, width]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedInterests, setSelectedInterests] = useState<InterestId[]>(DEFAULT_PREFERENCES.interests);

  const isLastSlide = currentIndex === SLIDES.length - 1;
  const currentSlide = SLIDES[currentIndex];

  const goToNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ animated: true, index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    }
  };

  const complete = async () => {
    await updatePreferences({ interests: selectedInterests });
    await setOnboardingSeen();
    router.replace('/register');
  };

  const toggleInterest = (interestId: InterestId) => {
    setSelectedInterests((currentInterests) => {
      if (currentInterests.includes(interestId)) {
        const nextInterests = currentInterests.filter((id) => id !== interestId);
        return nextInterests.length ? nextInterests : currentInterests;
      }

      return [...currentInterests, interestId];
    });
  };

  return (
    <View style={[styles.screen, { backgroundColor: currentSlide.bgFrom }]}>
      <FlatList
        data={SLIDES}
        extraData={width}
        getItemLayout={(_, index) => ({
          index,
          length: width,
          offset: width * index,
        })}
        horizontal
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(Math.min(Math.max(index, 0), SLIDES.length - 1));
        }}
        pagingEnabled
        ref={flatListRef}
        renderItem={({ item }) => <SlideItem item={item} width={width} />}
        showsHorizontalScrollIndicator={false}
        style={styles.slideList}
      />

      <OnboardingPanel
        currentIndex={currentIndex}
        isLastSlide={isLastSlide}
        layout={layout}
        onComplete={complete}
        onFallback={complete}
        onNext={goToNext}
        screenWidth={width}
        selectedInterestIds={selectedInterests}
        slide={currentSlide}
        onToggleInterest={toggleInterest}
      />
    </View>
  );
}
