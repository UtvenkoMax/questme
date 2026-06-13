import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { authenticateWithBiometrics } from '@/components/auth/biometric-auth';
import { PinEntryPanel } from '@/components/auth/pin-entry-panel';
import { PIN_LENGTH } from '@/components/auth/pin-code.types';
import { getUserProfile, hasPin, isBiometricEnabled, type UserProfile, verifyPin } from '@/services/auth-service';
import { getResponsiveMetrics } from '@/utils/responsive';

export default function LoginScreen() {
  const router = useRouter();
  const { height, width } = useWindowDimensions();
  const layout = useMemo(() => getResponsiveMetrics(width, height), [height, width]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [biometricEnabled, setBiometricEnabledState] = useState(false);
  const [pin, setPin] = useState('');
  const [message, setMessage] = useState('Р’РІРµРґС–С‚СЊ PIN-РєРѕРґ.');
  const [isBusy, setIsBusy] = useState(true);
  const compact = layout.isCompactHeight || layout.isCompactWidth;

  const unlock = useCallback(() => {
    router.replace('/home');
  }, [router]);

  const loginWithBiometrics = useCallback(async () => {
    if (!biometricEnabled) {
      setMessage('Р‘С–РѕРјРµС‚СЂРёС‡РЅРёР№ РІС…С–Рґ РІРёРјРєРЅРµРЅРѕ. РЈРІС–Р№РґС–С‚СЊ С‡РµСЂРµР· PIN.');
      return;
    }

    setIsBusy(true);
    setMessage('РџС–РґС‚РІРµСЂРґСЊС‚Рµ Р±С–РѕРјРµС‚СЂС–СЋ Сѓ СЃРёСЃС‚РµРјРЅРѕРјСѓ РІС–РєРЅС–.');
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
          setMessage('PIN-РєРѕРґ РЅРµРїСЂР°РІРёР»СЊРЅРёР№. РЎРїСЂРѕР±СѓР№С‚Рµ С‰Рµ СЂР°Р·.');
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
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingHorizontal: layout.gutter },
          layout.isWide && styles.contentWide,
          compact && styles.contentCompact,
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, compact && styles.headerCompact]}>
          <Text style={styles.eyebrow}>QuestMe</Text>
          <Text style={[styles.title, compact && styles.titleCompact]}>Р’С…С–Рґ</Text>
          <Text style={[styles.subtitle, compact && styles.subtitleCompact]}>
            {profile ? `Р’С–С‚Р°С”РјРѕ, ${profile.name}.` : 'Р—Р°РІР°РЅС‚Р°Р¶СѓС”РјРѕ РїСЂРѕС„С–Р»СЊ.'}
          </Text>
          <Text accessibilityLiveRegion="polite" style={[styles.message, compact && styles.messageCompact]}>
            {isBusy ? 'Р—Р°С‡РµРєР°Р№С‚Рµ...' : message}
          </Text>
          <View style={[styles.dots, compact && styles.dotsCompact]}>
            {Array.from({ length: PIN_LENGTH }, (_, index) => (
              <View
                key={index}
                style={[styles.dot, compact && styles.dotCompact, index < pin.length && styles.dotFilled]}
              />
            ))}
          </View>
        </View>

        <PinEntryPanel
          cancelLabel="РћС‡РёСЃС‚РёС‚Рё"
          compact={compact}
          onCancel={clearPin}
          onPressDigit={pressDigit}
        />

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            disabled={isBusy || !biometricEnabled}
            onPress={loginWithBiometrics}
            style={({ pressed }) => [
              styles.secondaryButton,
              (!biometricEnabled || isBusy) && styles.buttonDisabled,
              pressed && !isBusy && biometricEnabled && styles.buttonPressed,
            ]}
          >
            <Text style={styles.secondaryButtonText}>РЈРІС–Р№С‚Рё С‡РµСЂРµР· Face ID / Touch ID</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            disabled={isBusy}
            onPress={() => router.push({ pathname: '/pin-code', params: { mode: 'reset' } })}
            style={({ pressed }) => [styles.linkButton, pressed && styles.buttonPressed]}
          >
            <Text style={styles.linkButtonText}>Р—Р°Р±СѓР»Рё PIN?</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F4F0EA',
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 24,
    paddingHorizontal: 24,
    paddingTop: 34,
  },
  contentWide: {
    alignSelf: 'center',
    maxWidth: 520,
    width: '100%',
  },
  contentCompact: {
    paddingBottom: 16,
    paddingTop: 18,
  },
  header: {
    alignItems: 'center',
    flex: 1,
    gap: 14,
    justifyContent: 'center',
    minHeight: 220,
    width: '100%',
  },
  headerCompact: {
    gap: 9,
    minHeight: 160,
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
  titleCompact: {
    fontSize: 31,
    lineHeight: 37,
  },
  subtitle: {
    color: '#59616F',
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
  },
  subtitleCompact: {
    fontSize: 15,
    lineHeight: 21,
  },
  message: {
    color: '#59616F',
    fontSize: 15,
    lineHeight: 22,
    minHeight: 22,
    textAlign: 'center',
  },
  messageCompact: {
    fontSize: 14,
    lineHeight: 20,
  },
  dots: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 10,
  },
  dotsCompact: {
    gap: 11,
    marginTop: 4,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#4F5A68',
  },
  dotCompact: {
    width: 14,
    height: 14,
    borderRadius: 7,
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
