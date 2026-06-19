import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { authenticateWithBiometrics } from '@/components/auth/biometric-auth';
import { PinEntryPanel } from '@/components/auth/pin-entry-panel';
import { PIN_LENGTH } from '@/components/auth/pin-code.types';
import { Button } from '@/components/ui/button';
import { Notice } from '@/components/ui/status';
import {
  deleteLocalAccountData,
  getPinLockedUntil,
  getUserProfile,
  hasPin,
  isBiometricEnabled,
  startAuthSession,
  type UserProfile,
  verifyPin,
} from '@/services/auth-service';
import { getResponsiveMetrics } from '@/utils/responsive';
import { styles } from './login.styles';

function formatLockTime(date: Date) {
  return new Intl.DateTimeFormat('uk-UA', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export default function LoginScreen() {
  const router = useRouter();
  const { height, width } = useWindowDimensions();
  const layout = useMemo(() => getResponsiveMetrics(width, height), [height, width]);
  const compact = layout.isCompactHeight || layout.isCompactWidth;
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [biometricEnabled, setBiometricEnabledState] = useState(false);
  const [pin, setPin] = useState('');
  const [message, setMessage] = useState('Введіть PIN-код.');
  const [messageTone, setMessageTone] = useState<'neutral' | 'danger' | 'info'>('neutral');
  const [isBusy, setIsBusy] = useState(true);

  const unlock = useCallback(() => {
    router.replace('/quests' as never);
  }, [router]);

  const loginWithBiometrics = useCallback(async () => {
    if (!biometricEnabled) {
      setMessageTone('info');
      setMessage('Біометричний вхід вимкнено. Увійдіть через PIN.');
      return;
    }

    setIsBusy(true);
    setMessageTone('info');
    setMessage('Підтвердьте біометрію у системному вікні.');

    try {
      const result = await authenticateWithBiometrics();
      if (result.success) {
        await startAuthSession();
        unlock();
        return;
      }

      setMessageTone('danger');
      setMessage(result.message);
    } finally {
      setIsBusy(false);
    }
  }, [biometricEnabled, unlock]);

  useEffect(() => {
    let isMounted = true;

    async function loadLoginState() {
      const [storedProfile, pinExists, storedBiometricEnabled] = await Promise.all([
        getUserProfile(),
        hasPin(),
        isBiometricEnabled(),
      ]);

      if (!isMounted) return;

      if (!storedProfile) {
        router.replace('/');
        return;
      }

      if (!pinExists) {
        router.replace('/pin-code');
        return;
      }

      setProfile(storedProfile);
      setBiometricEnabledState(storedBiometricEnabled);
      setIsBusy(false);
    }

    loadLoginState();
    return () => {
      isMounted = false;
    };
  }, [router]);

  useEffect(() => {
    if (!profile || !biometricEnabled) return;
    const timer = setTimeout(loginWithBiometrics, 350);
    return () => clearTimeout(timer);
  }, [biometricEnabled, loginWithBiometrics, profile]);

  const completePin = useCallback(
    async (nextPin: string) => {
      setIsBusy(true);

      try {
        const isValid = await verifyPin(nextPin);
        setPin('');

        if (!isValid) {
          const lockedUntil = await getPinLockedUntil();
          setMessageTone('danger');
          setMessage(
            lockedUntil
              ? `Забагато спроб. Спробуйте після ${formatLockTime(lockedUntil)}.`
              : 'PIN-код неправильний. Спробуйте ще раз.'
          );
          return;
        }

        await startAuthSession();
        unlock();
      } finally {
        setIsBusy(false);
      }
    },
    [unlock]
  );

  const pressDigit = useCallback(
    (digit: string) => {
      if (isBusy || pin.length >= PIN_LENGTH) return;

      const nextPin = `${pin}${digit}`;
      setPin(nextPin);

      if (nextPin.length === PIN_LENGTH) {
        setTimeout(() => completePin(nextPin), 140);
      }
    },
    [completePin, isBusy, pin]
  );

  const clearPin = useCallback(() => {
    setPin('');
    setMessageTone('neutral');
    setMessage('Введіть PIN-код.');
  }, []);

  const confirmDeleteLocalData = useCallback(() => {
    Alert.alert(
      'Не памʼятаєте PIN?',
      'Для безпеки PIN не можна скинути без входу. Можна видалити локальний профіль і створити його заново.',
      [
        { style: 'cancel', text: 'Скасувати' },
        {
          onPress: async () => {
            await deleteLocalAccountData();
            router.replace('/onboarding');
          },
          style: 'destructive',
          text: 'Видалити дані',
        },
      ]
    );
  }, [router]);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingHorizontal: layout.gutter },
          layout.isWide && styles.contentWide,
          compact && styles.contentCompact,
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={[styles.header, compact && styles.headerCompact]}>
          <Text style={styles.eyebrow}>QuestMe</Text>
          <Text style={[styles.title, compact && styles.titleCompact]}>Вхід</Text>
          <Text style={[styles.subtitle, compact && styles.subtitleCompact]}>
            {profile ? `Вітаємо, ${profile.name}.` : 'Завантажуємо профіль.'}
          </Text>
          <Notice tone={isBusy ? 'info' : messageTone}>{isBusy ? 'Зачекайте...' : message}</Notice>
          <View style={[styles.dots, compact && styles.dotsCompact]}>
            {Array.from({ length: PIN_LENGTH }, (_, index) => (
              <View
                key={index}
                style={[styles.dot, compact && styles.dotCompact, index < pin.length && styles.dotFilled]}
              />
            ))}
          </View>
        </View>

        <PinEntryPanel cancelLabel="Очистити" compact={compact} onCancel={clearPin} onPressDigit={pressDigit} />

        <View style={styles.actions}>
          <Button
            disabled={isBusy || !biometricEnabled}
            icon="unlock"
            onPress={loginWithBiometrics}
            title="Увійти через Face ID / Touch ID"
            variant="secondary"
          />
          <Button
            disabled={isBusy}
            icon="refresh-cw"
            onPress={confirmDeleteLocalData}
            title="Забули PIN?"
            variant="ghost"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
