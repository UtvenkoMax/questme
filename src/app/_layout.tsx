import { Stack, type ErrorBoundaryProps } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet } from 'react-native';
import { SafeAreaProvider, initialWindowMetrics, SafeAreaView } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';

import { FaceIdStartupPrompt } from '@/components/auth/face-id-startup-prompt';
import { AppPreferencesProvider, useAppTheme } from '@/components/providers/app-preferences';
import { Button } from '@/components/ui/button';
import { queryClient } from '@/lib/query-client';
import { colors, spacing, typography } from '@/theme';
import '@/locales/i18n';

SplashScreen.setOptions({
  duration: 250,
  fade: true,
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <AppPreferencesProvider>
          <RootStack />
        </AppPreferencesProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

function RootStack() {
  const theme = useAppTheme();

  return (
    <>
      <FaceIdStartupPrompt />
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <SafeAreaView style={errorStyles.screen}>
      <View style={errorStyles.card}>
        <Text style={errorStyles.eyebrow}>QuestMe</Text>
        <Text style={errorStyles.title}>Щось пішло не так</Text>
        <Text style={errorStyles.message}>{error.message}</Text>
        <Button fullWidth={false} icon="refresh-cw" onPress={retry} title="Спробувати ще раз" />
      </View>
    </SafeAreaView>
  );
}

const errorStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    gap: spacing.md,
    margin: spacing.lg,
    padding: spacing.xl,
  },
  eyebrow: {
    ...typography.eyebrow,
    color: colors.primary,
  },
  message: {
    ...typography.body,
    color: colors.inkMuted,
  },
  screen: {
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    ...typography.titleCompact,
    color: colors.ink,
  },
});
