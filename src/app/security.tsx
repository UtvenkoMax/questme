import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Text, View } from 'react-native';

import { authenticateWithBiometrics } from '@/components/auth/biometric-auth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PageHeader, SectionHeader } from '@/components/ui/layout';
import { Screen } from '@/components/ui/screen';
import { LoadingState, Notice } from '@/components/ui/status';
import {
  deleteLocalAccountData,
  getUserProfile,
  isBiometricEnabled,
  logout,
  setBiometricEnabled as saveBiometricPreference,
  type UserProfile,
} from '@/services/auth-service';
import { colors, spacing, typography } from '@/theme';

export default function SecurityScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [biometricEnabled, setBiometricEnabledState] = useState(false);
  const [message, setMessage] = useState<{ text: string; tone: 'success' | 'danger' | 'neutral' } | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadSecurity = useCallback(async () => {
    setIsLoading(true);
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
    setIsLoading(false);
  }, [router]);

  useFocusEffect(
    useCallback(() => {
      loadSecurity();
    }, [loadSecurity])
  );

  const toggleBiometrics = async () => {
    setIsBusy(true);
    setMessage(null);

    try {
      if (biometricEnabled) {
        await saveBiometricPreference(false);
        setBiometricEnabledState(false);
        setMessage({ text: 'Біометричний вхід вимкнено.', tone: 'success' });
        return;
      }

      const result = await authenticateWithBiometrics({
        promptMessage: 'Підтвердьте біометрію для QuestMe',
      });

      if (!result.success) {
        setMessage({ text: result.message, tone: 'danger' });
        return;
      }

      await saveBiometricPreference(true);
      setBiometricEnabledState(true);
      setMessage({ text: `${result.biometricName} увімкнено.`, tone: 'success' });
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

  if (isLoading) {
    return (
      <Screen scroll={false}>
        <LoadingState text="Завантажуємо налаштування..." />
      </Screen>
    );
  }

  return (
    <Screen contentStyle={styles.content}>
      <Button fullWidth={false} icon="arrow-left" onPress={() => router.back()} size="sm" title="Назад" variant="ghost" />
      <PageHeader
        eyebrow="Безпека"
        subtitle={profile ? profile.email : 'Керуйте PIN і біометрією.'}
        title="Налаштування входу"
      />

      {message ? <Notice tone={message.tone}>{message.text}</Notice> : null}

      <Card style={styles.card}>
        <SectionHeader
          subtitle="PIN потрібен для входу й підтвердження зміни коду."
          title="PIN і біометрія"
        />
        <ActionRow
          description="Потрібен поточний PIN перед створенням нового."
          label="Змінити PIN"
          onPress={() => router.push({ pathname: '/pin-code', params: { mode: 'change' } })}
        />
        <ActionRow
          description="Створити новий PIN для входу."
          label="Скинути PIN"
          onPress={() => router.push({ pathname: '/pin-code', params: { mode: 'reset' } })}
        />
        <ActionRow
          description={biometricEnabled ? 'Face ID / Touch ID активний.' : 'Підтвердьте біометрію для швидкого входу.'}
          disabled={isBusy}
          label={biometricEnabled ? 'Вимкнути біометрію' : 'Увімкнути біометрію'}
          onPress={toggleBiometrics}
        />
      </Card>

      <Card style={styles.card}>
        <SectionHeader
          subtitle="Керуйте сесією та даними, які збережені на цьому пристрої."
          title="Дані акаунта"
        />
        <Button icon="log-out" onPress={signOut} title="Вийти з акаунта" variant="ghost" />
        <Button icon="trash-2" onPress={confirmDelete} title="Видалити локальні дані" variant="danger" />
      </Card>
    </Screen>
  );
}

type ActionRowProps = {
  description: string;
  disabled?: boolean;
  label: string;
  onPress: () => void;
};

function ActionRow({ description, disabled = false, label, onPress }: ActionRowProps) {
  return (
    <View style={styles.actionRow}>
      <View style={styles.actionCopy}>
        <Text style={styles.actionLabel}>{label}</Text>
        <Text style={styles.actionDescription}>{description}</Text>
      </View>
      <Button disabled={disabled} fullWidth={false} onPress={onPress} size="sm" title="Відкрити" variant="secondary" />
    </View>
  );
}

import { styles } from './security.styles';
