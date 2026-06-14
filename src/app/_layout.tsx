import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';

import { FaceIdStartupPrompt } from '@/components/auth/face-id-startup-prompt';
import '@/locales/i18n';

SplashScreen.setOptions({
  duration: 250,
  fade: true,
});

export default function RootLayout() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <FaceIdStartupPrompt />
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
