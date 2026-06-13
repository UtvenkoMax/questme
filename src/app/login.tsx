import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { authenticateWithBiometrics } from '@/components/auth/biometric-auth';
import { PinEntryPanel } from '@/components/auth/pin-entry-panel';
import { PIN_LENGTH } from '@/components/auth/pin-code.types';
import { getUserProfile, hasPin, isBiometricEnabled, type UserProfile, verifyPin } from '@/services/auth-service';

export default function LoginScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [biometricEnabled, setBiometricEnabledState] = useState(false);
  const [pin, setPin] = useState('');
  const [message, setMessage] = useState('Введіть PIN-код.');
  const [isBusy, setIsBusy] = useState(true);

  const unlock = useCallback(() => {
    router.replace('/home');
  }, [router]);

  const loginWithBiometrics = useCallback(async () => {
    if (!biometricEnabled) {
      setMessage('Біометричний вхід вимкнено. Увійдіть через PIN.');
      return;
    }

    setIsBusy(true);
    setMessage('Підтвердьте біометрію у системному вікні.');
    try {
      const result = await authenticateWithBiometrics();
      if (result.success) {
        unlock();
        return;
      }
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
          setMessage('PIN-код неправильний. Спробуйте ще раз.');
          return;
        }

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
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>QuestMe</Text>
          <Text style={styles.title}>Вхід</Text>
          <Text style={styles.subtitle}>
            {profile ? `Вітаємо, ${profile.name}.` : 'Завантажуємо профіль.'}
          </Text>
          <Text accessibilityLiveRegion="polite" style={styles.message}>
            {isBusy ? 'Зачекайте...' : message}
          </Text>
          <View style={styles.dots}>
            {Array.from({ length: PIN_LENGTH }, (_, index) => (
              <View key={index} style={[styles.dot, index < pin.length && styles.dotFilled]} />
            ))}
          </View>
        </View>

        <PinEntryPanel cancelLabel="Очистити" onCancel={clearPin} onPressDigit={pressDigit} />

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            disabled={isBusy || !biometricEnabled}
            onPress={loginWithBiometrics}
            style={({ pressed }) => [
              styles.secondaryButton,
              (!biometricEnabled || isBusy) && styles.buttonDisabled,
              pressed && !isBusy && biometricEnabled && styles.buttonPressed,
            ]}>
            <Text style={styles.secondaryButtonText}>Увійти через Face ID / Touch ID</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            disabled={isBusy}
            onPress={() => router.push({ pathname: '/pin-code', params: { mode: 'reset' } })}
            style={({ pressed }) => [styles.linkButton, pressed && styles.buttonPressed]}>
            <Text style={styles.linkButtonText}>Забули PIN?</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F4F0EA',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 24,
    paddingHorizontal: 24,
    paddingTop: 34,
  },
  header: {
    alignItems: 'center',
    gap: 14,
    minHeight: '34%',
    justifyContent: 'center',
    width: '100%',
  },
  eyebrow: {
    color: '#2D6A5F',
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  title: {
    color: '#171B22',
    fontSize: 38,
    fontWeight: '800',
    lineHeight: 44,
  },
  subtitle: {
    color: '#59616F',
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
  },
  message: {
    color: '#59616F',
    fontSize: 15,
    lineHeight: 22,
    minHeight: 22,
    textAlign: 'center',
  },
  dots: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 10,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#4F5A68',
  },
  dotFilled: {
    backgroundColor: '#2D6A5F',
    borderColor: '#2D6A5F',
  },
  actions: {
    alignSelf: 'stretch',
    gap: 12,
    paddingBottom: 8,
  },
  secondaryButton: {
    alignItems: 'center',
    borderColor: '#2D6A5F',
    borderRadius: 16,
    borderWidth: 1.5,
    justifyContent: 'center',
    minHeight: 54,
    paddingHorizontal: 14,
  },
  secondaryButtonText: {
    color: '#2D6A5F',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
  buttonDisabled: {
    borderColor: '#9BA29B',
    opacity: 0.7,
  },
  buttonPressed: {
    opacity: 0.72,
  },
  linkButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  linkButtonText: {
    color: '#4F5A68',
    fontSize: 15,
    fontWeight: '800',
  },
});
