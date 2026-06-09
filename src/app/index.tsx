import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SlideToRegister } from '@/components/auth/slide-to-register';
import { startScreenStyles as styles } from '@/components/auth/start-screen.styles';

export default function StartScreen() {
  const [showSlider, setShowSlider] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSlider(true);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <View style={styles.screen}>
      <Image
        accessibilityLabel="Стартове зображення QuestMe"
        contentFit="cover"
        source={require('@/assets/images/startimage.png')}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        {showSlider && (
          <View style={styles.sliderPanel}>
            <SlideToRegister />
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}
