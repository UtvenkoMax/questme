import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { authenticateWithBiometrics } from '@/components/auth/biometric-auth';
import {
  deleteLocalAccountData,
  getUserProfile,
  isBiometricEnabled,
  logout,
  setBiometricEnabled as saveBiometricPreference,
  type UserProfile,
} from '@/services/auth-service';
import { getResponsiveMetrics } from '@/utils/responsive';

export default function SecurityScreen() {
  const router = useRouter();
  const { height, width } = useWindowDimensions();
  const layout = useMemo(() => getResponsiveMetrics(width, height), [height, width]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [biometricEnabled, setBiometricEnabledState] = useState(false);
  const [message, setMessage] = useState('');
  const [isBusy, setIsBusy] = useState(false);

  const loadSecurity = useCallback(async () => {
    const [storedProfile, storedBiometricEnabled] = await Promise.all([
      getUserProfile(),
      isBiometricEnabled(),
    ]);

    if (!storedProfile) {
      router.replace('/');
      return;
    }

    setProfile(storedProfile);
    setBiometricEnabledState(storedBiometricEnabled);
  }, [router]);

  useFocusEffect(
    useCallback(() => {
      loadSecurity();
    }, [loadSecurity])
  );

  const toggleBiometrics = async () => {
    setIsBusy(true);
    setMessage('');

    try {
      if (biometricEnabled) {
        await saveBiometricPreference(false);
        setBiometricEnabledState(false);
        setMessage('Біометричний вхід вимкнено.');
        return;
      }

      const result = await authenticateWithBiometrics({
        promptMessage: 'Підтвердьте біометрію для QuestMe',
      });

      if (!result.success) {
        setMessage(result.message);
        return;
      }

      await saveBiometricPreference(true);
      setBiometricEnabledState(true);
      setMessage(`${result.biometricName} увімкнено.`);
    } finally {
      setIsBusy(false);
    }
  };

  const signOut = async () => {
    await logout();
    router.replace('/login');
  };

  const confirmDelete = () => {
    Alert.alert(
      'Видалити локальні дані?',
      'Це очистить профіль, PIN, біометричні налаштування та всі квести на цьому пристрої.',
      [
        { style: 'cancel', text: 'Скасувати' },
        {
          onPress: async () => {
            await deleteLocalAccountData();
            router.replace('/onboarding');
          },
          style: 'destructive',
          text: 'Видалити',
        },
      ]
    );
  };
  const compact = layout.isCompactHeight || layout.isCompactWidth;

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingHorizontal: layout.gutter },
          layout.isWide && styles.contentWide,
          compact && styles.contentCompact,
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backButton, pressed && styles.buttonPressed]}>
          <Text style={styles.backButtonText}>Назад</Text>
        </Pressable>

        <View style={styles.header}>
          <Text style={styles.eyebrow}>Безпека</Text>
          <Text style={styles.title}>Налаштування входу</Text>
          <Text style={styles.subtitle}>
            {profile ? `${profile.email}` : 'Керуйте PIN і біометрією.'}
          </Text>
        </View>

        {message ? (
          <Text accessibilityLiveRegion="polite" style={styles.message}>
            {message}
          </Text>
        ) : null}

        <View style={styles.section}>
          <ActionButton
            description="Потрібен поточний PIN перед створенням нового."
            label="Змінити PIN"
            onPress={() => router.push({ pathname: '/pin-code', params: { mode: 'change' } })}
          />
          <ActionButton
            description="Створити новий PIN для входу."
            label="Скинути PIN"
            onPress={() => router.push({ pathname: '/pin-code', params: { mode: 'reset' } })}
          />
          <ActionButton
            description={biometricEnabled ? 'Face ID / Touch ID активний.' : 'Підтвердьте біометрію для швидкого входу.'}
            disabled={isBusy}
            label={biometricEnabled ? 'Вимкнути біометрію' : 'Увімкнути біометрію'}
            onPress={toggleBiometrics}
          />
        </View>

        <View style={styles.section}>
          <ActionButton
            description="Профіль залишиться на пристрої, але сесія буде закрита."
            label="Вийти з акаунта"
            onPress={signOut}
          />
          <ActionButton
            danger
            description="Очистити профіль, PIN, квести та локальні налаштування."
            label="Видалити локальні дані"
            onPress={confirmDelete}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type ActionButtonProps = {
  danger?: boolean;
  description: string;
  disabled?: boolean;
  label: string;
  onPress: () => void;
};

function ActionButton({ danger = false, description, disabled = false, label, onPress }: ActionButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionButton,
        danger && styles.actionDanger,
        disabled && styles.actionDisabled,
        pressed && !disabled && styles.buttonPressed,
      ]}>
      <Text style={[styles.actionLabel, danger && styles.actionLabelDanger]}>{label}</Text>
      <Text style={styles.actionDescription}>{description}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F4F0EA',
  },
  content: {
    gap: 22,
    paddingHorizontal: 24,
    paddingVertical: 28,
  },
  contentWide: {
    alignSelf: 'center',
    maxWidth: 620,
    width: '100%',
  },
  contentCompact: {
    gap: 18,
    paddingVertical: 18,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
  },
  backButtonText: {
    color: '#4F5A68',
    fontSize: 16,
    fontWeight: '800',
  },
  header: {
    gap: 10,
  },
  eyebrow: {
    color: '#2D6A5F',
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  title: {
    color: '#171B22',
    fontSize: 36,
    fontWeight: '900',
    lineHeight: 42,
  },
  subtitle: {
    color: '#59616F',
    fontSize: 16,
    lineHeight: 23,
  },
  message: {
    color: '#59616F',
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 20,
  },
  section: {
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D6D0C8',
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
    minHeight: 78,
    padding: 16,
  },
  actionDanger: {
    borderColor: '#D7A1A1',
  },
  actionDisabled: {
    opacity: 0.68,
  },
  actionLabel: {
    color: '#171B22',
    fontSize: 16,
    fontWeight: '900',
  },
  actionLabelDanger: {
    color: '#B33A3A',
  },
  actionDescription: {
    color: '#59616F',
    fontSize: 14,
    lineHeight: 20,
  },
  buttonPressed: {
    opacity: 0.76,
  },
});
