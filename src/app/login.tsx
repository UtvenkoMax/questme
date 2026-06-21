import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { authenticateWithBiometrics } from '@/components/auth/biometric-auth';
import { GlitchLogo } from '@/components/auth/GlitchLogo';
import { PinEntryPanel } from '@/components/auth/pin-entry-panel';
import { PIN_LENGTH } from '@/components/auth/pin-code.types';
import { ChaosButton } from '@/components/ui/chaos';
import { Notice } from '@/components/ui/status';
import { Screen } from '@/components/ui/screen';
import { questColors } from '@/constants/colors';
import { radii, spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
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
    setMessage('Підтвердіть біометрію у системному вікні.');

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
      'Можна відновити доступ через email або видалити локальний профіль і створити його заново.',
      [
        { style: 'cancel', text: 'Скасувати' },
        {
          onPress: () => router.push('/recover' as never),
          text: 'Відновити через email',
        },
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
    <Screen contentStyle={styles.content} scroll={false}>
      <View style={styles.card}>
        <GlitchLogo compact={compact} />
        <View style={styles.header}>
          <Text style={styles.kicker}>SECURE ENTRY</Text>
          <Text style={styles.title}>Вхід</Text>
          <Text style={styles.subtitle}>
            {profile ? `Вітаємо, ${profile.name}.` : 'Завантажуємо профіль.'}
          </Text>
          <Notice tone={isBusy ? 'info' : messageTone}>{isBusy ? 'Зачекайте...' : message}</Notice>
          <View style={styles.dots}>
            {Array.from({ length: PIN_LENGTH }, (_, index) => (
              <View key={index} style={[styles.dot, index < pin.length && styles.dotFilled]} />
            ))}
          </View>
        </View>

        <PinEntryPanel cancelLabel="Очистити" compact={compact} onCancel={clearPin} onPressDigit={pressDigit} />

        <View style={styles.actions}>
          <ChaosButton label="Face ID / Touch ID" onPress={loginWithBiometrics} variant={biometricEnabled ? 'electric' : 'ghost'} />
          <ChaosButton label="Забули PIN?" onPress={confirmDeleteLocalData} variant="outline" />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: spacing.sm,
  },
  card: {
    backgroundColor: 'rgba(17,17,24,0.9)',
    borderColor: questColors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    gap: spacing.lg,
    padding: spacing.lg,
  },
  content: {
    justifyContent: 'center',
    paddingBottom: spacing.xl,
    paddingTop: spacing.xl,
  },
  dot: {
    borderColor: questColors.border,
    borderRadius: radii.pill,
    borderWidth: 1,
    height: 12,
    width: 12,
  },
  dotFilled: {
    backgroundColor: questColors.acid,
    borderColor: questColors.acid,
  },
  dots: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  header: {
    gap: spacing.sm,
  },
  kicker: {
    ...typography.eyebrow,
    color: questColors.acid,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: questColors.textSecondary,
    textAlign: 'center',
  },
  title: {
    ...typography.title,
    color: questColors.textPrimary,
    textAlign: 'center',
  },
});
