import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, PanResponder, Pressable, Text, View, type LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { authenticateWithBiometrics } from '@/components/auth/biometric-auth';
import { useAppPreferences } from '@/components/providers/app-preferences';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PageHeader, SectionHeader } from '@/components/ui/layout';
import { Screen } from '@/components/ui/screen';
import { LoadingState, Notice } from '@/components/ui/status';
import { keychains } from '@/data/platform-features';
import {
  deleteLocalAccountData,
  getAuthSession,
  getUserProfile,
  hasPin,
  isBiometricEnabled,
  logout,
  setBiometricEnabled as saveBiometricPreference,
  type UserProfile,
} from '@/services/auth-service';
import { INTEREST_OPTIONS, type InterestId, type LanguagePreference, type ThemePreference } from '@/services/preferences-service';
import { usePlatformStore } from '@/store';
import { styles } from '@/styles/security.styles';
import { spacing } from '@/theme';

const SEGMENT_INSET = spacing.xxs;
const SEGMENT_GAP = spacing.xs;
const SEGMENT_SPRING = {
  damping: 18,
  mass: 0.8,
  stiffness: 260,
};

const THEME_OPTIONS: { label: string; value: ThemePreference }[] = [
  { label: 'Система', value: 'system' },
  { label: 'Світла', value: 'light' },
  { label: 'Темна', value: 'dark' },
];

const LANGUAGE_OPTIONS: { label: string; value: LanguagePreference }[] = [
  { label: 'Система', value: 'system' },
  { label: 'Українська', value: 'uk' },
  { label: 'English', value: 'en' },
];

export default function SecurityScreen() {
  const router = useRouter();
  const { preferences, updatePreferences } = useAppPreferences();
  const dailySpinDate = usePlatformStore((state) => state.dailySpinDate);
  const inventory = usePlatformStore((state) => state.keychainInventory);
  const spinTokens = usePlatformStore((state) => state.spinTokens);
  const spinKeychainRoulette = usePlatformStore((state) => state.spinKeychainRoulette);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [biometricEnabled, setBiometricEnabledState] = useState(false);
  const [message, setMessage] = useState<{ text: string; tone: 'success' | 'danger' | 'neutral' } | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadSecurity = useCallback(async () => {
    setIsLoading(true);
    const [storedProfile, session, pinExists, storedBiometricEnabled] = await Promise.all([
      getUserProfile(),
      getAuthSession(),
      hasPin(),
      isBiometricEnabled(),
    ]);

    if (!storedProfile) {
      router.replace('/');
      return;
    }

    if (!pinExists) {
      router.replace('/pin-code');
      return;
    }

    if (!session) {
      router.replace('/login');
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
    router.replace('/register');
  };

  const toggleInterest = async (interestId: InterestId) => {
    const interests = preferences.interests.includes(interestId)
      ? preferences.interests.filter((id) => id !== interestId)
      : [...preferences.interests, interestId];

    await updatePreferences({ interests: interests.length ? interests : [interestId] });
  };

  const spinKeychain = (source: 'daily' | 'mission') => {
    const result = spinKeychainRoulette(source);
    setMessage({ text: result.message, tone: result.ok ? 'success' : 'neutral' });
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
          subtitle="Тема, мова та інтереси зберігаються локально на цьому пристрої."
          title="Налаштування застосунку"
        />
        <ChoiceGroup
          label="Тема"
          onSelect={(theme) => updatePreferences({ theme })}
          options={THEME_OPTIONS}
          value={preferences.theme}
        />
        <ChoiceGroup
          label="Мова"
          onSelect={(language) => updatePreferences({ language })}
          options={LANGUAGE_OPTIONS}
          value={preferences.language}
        />
        <View style={styles.choiceGroup}>
          <Text style={styles.choiceLabel}>Інтереси</Text>
          <View style={styles.chipGrid}>
            {INTEREST_OPTIONS.map((interest) => {
              const selected = preferences.interests.includes(interest.id);
              return (
                <Pressable
                  accessibilityRole="button"
                  key={interest.id}
                  onPress={() => toggleInterest(interest.id)}
                  style={[styles.chip, selected && styles.chipSelected]}>
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{interest.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </Card>

      <Card style={styles.card}>
        <SectionHeader
          subtitle="Косметична колекція без платних spinів: 1 daily або токени за місії."
          title="Рулетка брелків"
        />
        <View style={styles.rouletteStats}>
          <Text style={styles.actionDescription}>
            Зібрано брелків: {Object.values(inventory).reduce((sum, count) => sum + count, 0)} · spin-токени: {spinTokens}
          </Text>
          <Text style={styles.actionDescription}>
            Доступні: {keychains.map((keychain) => keychain.label).join(', ')}
          </Text>
        </View>
        <View style={styles.rouletteActions}>
          <Button
            disabled={dailySpinDate === new Date().toISOString().slice(0, 10)}
            fullWidth={false}
            icon="refresh-cw"
            onPress={() => spinKeychain('daily')}
            title="Daily spin"
            variant="secondary"
          />
          <Button
            disabled={spinTokens <= 0}
            fullWidth={false}
            icon="disc"
            onPress={() => spinKeychain('mission')}
            title={`Mission spin (${spinTokens})`}
            variant="secondary"
          />
        </View>
      </Card>

      <Card style={styles.card}>
        <SectionHeader
          subtitle="Керуйте сесією та даними, які збережені на цьому пристрої."
          title="Дані акаунта"
        />
        <Button icon="log-out" onPress={signOut} title="Вийти з акаунта" variant="danger" />
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

type ChoiceOption<T extends string> = {
  label: string;
  value: T;
};

type ChoiceGroupProps<T extends string> = {
  label: string;
  onSelect: (value: T) => void;
  options: ChoiceOption<T>[];
  value: T;
};

function ChoiceGroup<T extends string>({ label, onSelect, options, value }: ChoiceGroupProps<T>) {
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value)
  );
  const [segmentWidth, setSegmentWidth] = useState(0);
  const slideX = useSharedValue(0);
  const dragStartX = useSharedValue(0);
  const usableWidth = Math.max(segmentWidth - SEGMENT_INSET * 2 - SEGMENT_GAP * (options.length - 1), 0);
  const optionWidth = options.length ? usableWidth / options.length : 0;
  const step = optionWidth + SEGMENT_GAP;
  const maxSlideX = step * Math.max(options.length - 1, 0);

  const getTargetX = useCallback(
    (index: number) => step * Math.max(0, Math.min(index, options.length - 1)),
    [options.length, step]
  );
  const clampSlideX = useCallback((nextX: number) => Math.max(0, Math.min(nextX, maxSlideX)), [maxSlideX]);

  const settleToIndex = useCallback(
    (index: number) => {
      slideX.value = withSpring(getTargetX(index), SEGMENT_SPRING);
    },
    [getTargetX, slideX]
  );

  const selectIndex = useCallback(
    (index: number) => {
      const nextIndex = Math.max(0, Math.min(index, options.length - 1));
      const nextOption = options[nextIndex];

      if (!nextOption) return;

      settleToIndex(nextIndex);
      onSelect(nextOption.value);
    },
    [onSelect, options, settleToIndex]
  );

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    setSegmentWidth(event.nativeEvent.layout.width);
  }, []);

  useEffect(() => {
    if (!optionWidth) return;
    settleToIndex(selectedIndex);
  }, [optionWidth, selectedIndex, settleToIndex]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) =>
          optionWidth > 0 && Math.abs(gesture.dx) > 4 && Math.abs(gesture.dx) > Math.abs(gesture.dy),
        onMoveShouldSetPanResponderCapture: (_, gesture) =>
          optionWidth > 0 && Math.abs(gesture.dx) > 4 && Math.abs(gesture.dx) > Math.abs(gesture.dy),
        onPanResponderGrant: (event, gesture) => {
          const touchStartX = event.nativeEvent.locationX - SEGMENT_INSET - optionWidth / 2 - gesture.dx;
          const nextX = Number.isFinite(touchStartX) ? clampSlideX(touchStartX) : getTargetX(selectedIndex);

          dragStartX.value = nextX;
          slideX.value = nextX;
        },
        onPanResponderMove: (_, gesture) => {
          const nextX = clampSlideX(dragStartX.value + gesture.dx);
          slideX.value = nextX;
        },
        onPanResponderRelease: (_, gesture) => {
          const rawIndex = step ? Math.round(clampSlideX(dragStartX.value + gesture.dx) / step) : selectedIndex;
          selectIndex(rawIndex);
        },
        onPanResponderTerminate: () => settleToIndex(selectedIndex),
      }),
    [clampSlideX, dragStartX, getTargetX, optionWidth, selectIndex, selectedIndex, settleToIndex, slideX, step]
  );

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slideX.value }],
  }));

  return (
    <View style={styles.choiceGroup}>
      <Text style={styles.choiceLabel}>{label}</Text>
      <View onLayout={handleLayout} style={styles.segment} {...panResponder.panHandlers}>
        {optionWidth > 0 ? (
          <Animated.View pointerEvents="none" style={[styles.segmentThumb, { width: optionWidth }, thumbStyle]} />
        ) : null}
        {options.map((option, optionIndex) => {
          const selected = option.value === value;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected }}
              key={option.value}
              onPress={() => selectIndex(optionIndex)}
              style={({ pressed }) => [
                styles.segmentButton,
                optionWidth <= 0 && selected && styles.segmentButtonSelected,
                pressed && styles.segmentButtonPressed,
              ]}>
              <Text style={[styles.segmentText, selected && styles.segmentTextSelected]}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
