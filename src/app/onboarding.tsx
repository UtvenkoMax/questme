import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type ImageSourcePropType,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { StepIndicator } from '@/components/auth/StepIndicator';
import { ChaosButton } from '@/components/ui/chaos';
import { gradients, questColors } from '@/constants/colors';
import { radii, spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { DEFAULT_PREFERENCES } from '@/services/preferences-service';
import { useAppPreferences } from '@/components/providers/app-preferences';
import { setOnboardingSeen } from '@/services/auth-service';

type Slide = {
  id: string;
  title: string;
  kicker: string;
  counter?: string;
  image: ImageSourcePropType;
};

const slides: Slide[] = [
  {
    id: 'quester',
    title: 'Роби дурниці.\nОтримуй гроші.',
    kicker: 'Ставай квестером',
    image: require('@/assets/images/startimage.png'),
  },
  {
    id: 'creator',
    title: 'Придумай завдання —\nзаплати за виконання.',
    kicker: 'Ставай автором',
    counter: '+2,341 грн зароблено сьогодні',
    image: require('@/assets/images/onboarding2.png'),
  },
  {
    id: 'join',
    title: '14,892 активних квестів\nпрямо зараз',
    kicker: 'Приєднуйся',
    image: require('@/assets/images/onboarding3.png'),
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { updatePreferences } = useAppPreferences();
  const listRef = useRef<FlatList<Slide>>(null);
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const complete = async () => {
    await updatePreferences({ interests: DEFAULT_PREFERENCES.interests });
    await setOnboardingSeen();
    router.replace('/register');
  };

  const next = () => {
    if (index < slides.length - 1) {
      listRef.current?.scrollToIndex({ animated: true, index: index + 1 });
      setIndex(index + 1);
      return;
    }

    complete();
  };

  const onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIndex(Math.round(event.nativeEvent.contentOffset.x / width));
  };

  return (
    <View style={styles.screen}>
      <FlatList
        data={slides}
        horizontal
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={onScrollEnd}
        pagingEnabled
        ref={listRef}
        renderItem={({ item }) => <SlideView slide={item} width={width} />}
        showsHorizontalScrollIndicator={false}
      />

      <View style={styles.bottom}>
        <StepIndicator count={slides.length} index={index} />
        {index === slides.length - 1 ? (
          <View style={styles.ctaRow}>

            <ChaosButton label="Почати безкоштовно" onPress={complete} style={styles.ctaGrow} />
          </View>
        ) : (
          <ChaosButton label="Далі" onPress={next} />
        )}
      </View>
    </View>
  );
}

function SlideView({ slide, width }: { slide: Slide; width: number }) {
  return (
    <View style={[styles.slide, { width }]}>
      <Image contentFit="cover" source={slide.image} style={StyleSheet.absoluteFill} />
      <LinearGradient colors={gradients.heroShade} style={StyleSheet.absoluteFill} />
      <View style={styles.noiseGrid} pointerEvents="none" />
      <Animated.View entering={FadeInUp.duration(360).springify()} style={styles.copy}>
        <Text style={styles.kicker}>{slide.kicker}</Text>
        <Text style={styles.title}>{slide.title}</Text>
        {slide.counter ? (
          <View style={styles.counter}>
            <Text style={styles.counterText}>{slide.counter}</Text>
          </View>
        ) : null}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottom: {
    bottom: spacing.xl,
    gap: spacing.lg,
    left: spacing.lg,
    position: 'absolute',
    right: spacing.lg,
  },
  counter: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(196,255,0,0.14)',
    borderColor: 'rgba(196,255,0,0.48)',
    borderRadius: radii.xs,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  counterText: {
    ...typography.label,
    color: questColors.acid,
  },
  copy: {
    bottom: 164,
    gap: spacing.md,
    left: spacing.lg,
    position: 'absolute',
    right: spacing.lg,
  },
  ctaGrow: {
    flex: 1.4,
  },
  ctaHalf: {
    flex: 0.8,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  kicker: {
    ...typography.label,
    color: questColors.acid,
    textTransform: 'uppercase',
  },
  noiseGrid: {
    ...StyleSheet.absoluteFillObject,
    borderColor: 'rgba(240,238,255,0.06)',
    borderWidth: 1,
  },
  screen: {
    backgroundColor: questColors.void,
    flex: 1,
  },
  slide: {
    backgroundColor: questColors.void,
    flex: 1,
  },
  title: {
    ...typography.display,
    color: questColors.textPrimary,
    maxWidth: 430,
  },
});
