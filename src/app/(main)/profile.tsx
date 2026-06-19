import { Feather } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Text, View } from 'react-native';

import { authenticateWithBiometrics } from '@/components/auth/biometric-auth';
import { PIN_LENGTH } from '@/components/auth/pin-code.types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Metric, PageHeader, SectionHeader } from '@/components/ui/layout';
import { ProgressRing } from '@/components/ui/progress-ring';
import { Screen } from '@/components/ui/screen';
import { LoadingState, Notice } from '@/components/ui/status';
import { TextField } from '@/components/ui/text-field';
import {
  getPinLockedUntil,
  getUserProfile,
  hasProfileErrors,
  isBiometricEnabled,
  normalizeEmail,
  updateUserProfile,
  validateProfile,
  verifyPin,
  type UserProfile,
} from '@/services/auth-service';
import { getAchievements } from '@/services/achievement-service';
import { getQuestProgress, getQuests, type Quest } from '@/services/quest-service';
import { colors } from '@/theme';
import { styles } from './profile.styles';

function formatDate(value: string) {
  return new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
}

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmationPin, setConfirmationPin] = useState('');
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [isProfileChangeVerified, setIsProfileChangeVerified] = useState(false);
  const [message, setMessage] = useState<{ text: string; tone: 'success' | 'danger' | 'neutral' } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      async function loadProfile() {
        setIsLoading(true);
        const [storedProfile, storedQuests, storedBiometricEnabled] = await Promise.all([
          getUserProfile(),
          getQuests(),
          isBiometricEnabled(),
        ]);
        if (!isMounted) return;

        if (!storedProfile) {
          router.replace('/');
          return;
        }

        setProfile(storedProfile);
        setName(storedProfile.name);
        setEmail(storedProfile.email);
        setBiometricEnabled(storedBiometricEnabled);
        setConfirmationPin('');
        setIsProfileChangeVerified(false);
        setQuests(storedQuests);
        setIsLoading(false);
      }

      loadProfile();
      return () => {
        isMounted = false;
      };
    }, [router])
  );

  const errors = useMemo(() => validateProfile({ email, name }), [email, name]);
  const progress = useMemo(() => getQuestProgress(quests), [quests]);
  const achievements = useMemo(() => getAchievements(quests), [quests]);
  const completedQuests = quests.filter((quest) => quest.completed);
  const unlockedAchievements = achievements.filter((achievement) => achievement.unlocked);
  const initials = (profile?.name ?? 'Q')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const hasProfileChanges = useMemo(() => {
    if (!profile) return false;
    return name.trim() !== profile.name || normalizeEmail(email) !== profile.email;
  }, [email, name, profile]);
  const canSave =
    !hasProfileErrors(errors) &&
    !isSaving &&
    (!hasProfileChanges || isProfileChangeVerified || confirmationPin.length === PIN_LENGTH);

  const verifyProfileChangeWithBiometrics = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      const result = await authenticateWithBiometrics({
        promptMessage: 'Підтвердьте зміну профілю',
      });

      setIsProfileChangeVerified(result.success);
      setMessage({ text: result.message, tone: result.success ? 'success' : 'danger' });
    } finally {
      setIsSaving(false);
    }
  };

  const saveProfile = async () => {
    if (!canSave) return;

    setIsSaving(true);
    setMessage(null);

    try {
      if (hasProfileChanges && !isProfileChangeVerified) {
        const isPinValid = await verifyPin(confirmationPin);
        if (!isPinValid) {
          const lockedUntil = await getPinLockedUntil();
          setMessage({
            text: lockedUntil
              ? `Забагато невдалих спроб. Повторіть після ${lockedUntil.toLocaleTimeString('uk-UA', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}.`
              : 'PIN не підтверджено. Перевірте код і спробуйте ще раз.',
            tone: 'danger',
          });
          setConfirmationPin('');
          return;
        }

        setIsProfileChangeVerified(true);
      }

      const nextProfile = await updateUserProfile({ email, name });
      setProfile(nextProfile);
      setConfirmationPin('');
      setIsProfileChangeVerified(false);
      setMessage({ text: 'Профіль оновлено.', tone: 'success' });
    } catch (error) {
      setMessage({
        text: error instanceof Error ? error.message : 'Не вдалося оновити профіль.',
        tone: 'danger',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Screen scroll={false}>
        <LoadingState text="Завантажуємо профіль..." />
      </Screen>
    );
  }

  return (
    <Screen contentStyle={styles.content}>
      <PageHeader
        action={
          <View style={styles.headerActions}>
            <Button fullWidth={false} icon="award" onPress={() => router.push('/achievements' as never)} size="sm" title="Бейджі" variant="secondary" />
            <Button fullWidth={false} icon="shield" onPress={() => router.push('/security')} size="sm" title="Безпека" variant="ghost" />
          </View>
        }
        eyebrow="Профіль"
        subtitle={profile ? `Створено ${formatDate(profile.createdAt)}` : 'Ваш локальний профіль QuestMe.'}
        title={profile?.name ?? 'QuestMe'}
      />

      <Card style={styles.profileHero}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.profileHeroCopy}>
          <Text style={styles.profileName}>{profile?.name ?? 'QuestMe'}</Text>
          <Text style={styles.profileMeta}>Level {progress.level} · {progress.totalPoints} XP</Text>
          <View style={styles.levelTrack}>
            <View style={[styles.levelFill, { width: `${progress.levelProgressPercent}%` }]} />
          </View>
        </View>
        <ProgressRing label="рівень" percent={progress.levelProgressPercent} size={92} value={`${progress.level}`} />
      </Card>

      <View style={styles.metrics}>
        <Metric label="Виконано" value={`${progress.completedCount}/${progress.totalCount}`} />
        <Metric label="Балів" value={progress.totalPoints} />
        <Metric label="Прогрес" value={`${progress.completionPercent}%`} />
      </View>

      <Card style={styles.card}>
        <SectionHeader
          action={<Button fullWidth={false} icon="arrow-right" onPress={() => router.push('/achievements' as never)} size="sm" title="Усі" variant="ghost" />}
          subtitle={`${unlockedAchievements.length}/${achievements.length} відкрито`}
          title="Досягнення"
        />
        <View style={styles.badgeGrid}>
          {achievements.slice(0, 4).map((achievement) => (
            <View key={achievement.id} style={[styles.badgeCard, !achievement.unlocked && styles.badgeCardLocked]}>
              <View style={[styles.badgeIcon, achievement.unlocked && styles.badgeIconUnlocked]}>
                <Feather color={achievement.unlocked ? '#FFFFFF' : '#7A7A7A'} name={achievement.icon} size={18} />
              </View>
              <Text numberOfLines={1} style={styles.badgeTitle}>{achievement.title}</Text>
              <Text numberOfLines={2} style={styles.badgeText}>
                {achievement.unlocked ? 'Відкрито' : 'Закрито'}
              </Text>
            </View>
          ))}
        </View>
      </Card>

      <Card style={styles.card}>
        <SectionHeader
          subtitle="Останні персональні місії, які ви завершили"
          title="Історія квестів"
        />
        {completedQuests.length ? (
          <View style={styles.historyList}>
            {completedQuests.slice(0, 4).map((quest) => (
              <View key={quest.id} style={styles.historyRow}>
                <View style={styles.historyIcon}>
                  <Feather color={colors.success} name="check" size={16} />
                </View>
                <View style={styles.historyCopy}>
                  <Text style={styles.historyTitle}>{quest.title}</Text>
                  <Text style={styles.historyText}>+{quest.points} XP · {quest.completedAt ? formatDate(quest.completedAt) : 'сьогодні'}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Notice tone="neutral">Завершіть перший квест, і тут зʼявиться історія активності.</Notice>
        )}
      </Card>

      <Card style={styles.card}>
        <SectionHeader
          subtitle="Ці дані використовуються локально та для майбутньої синхронізації з акаунтом."
          title="Особисті дані"
        />
        <TextField
          autoCapitalize="words"
          autoComplete="name"
          error={errors.name}
          label="Імʼя"
          onChangeText={setName}
          placeholder="Ваше імʼя"
          textContentType="name"
          value={name}
        />
        <TextField
          autoCapitalize="none"
          autoComplete="email"
          error={errors.email}
          inputMode="email"
          keyboardType="email-address"
          label="Email"
          onChangeText={setEmail}
          placeholder="you@example.com"
          textContentType="emailAddress"
          value={email}
        />
        {hasProfileChanges && !isProfileChangeVerified ? (
          <View style={styles.reauthBox}>
            <Text style={styles.reauthText}>
              Щоб змінити email або імʼя профілю, підтвердьте дію PIN-кодом або біометрією.
            </Text>
            <TextField
              inputMode="numeric"
              keyboardType="number-pad"
              label="PIN для підтвердження"
              maxLength={PIN_LENGTH}
              onChangeText={setConfirmationPin}
              placeholder="••••"
              secureTextEntry
              value={confirmationPin}
            />
            {biometricEnabled ? (
              <Button
                disabled={isSaving}
                icon="shield"
                onPress={verifyProfileChangeWithBiometrics}
                title="Підтвердити біометрією"
                variant="secondary"
              />
            ) : null}
          </View>
        ) : null}
        {message ? <Notice tone={message.tone}>{message.text}</Notice> : null}
        <Button disabled={!canSave} icon="save" loading={isSaving} onPress={saveProfile} title="Зберегти зміни" />
      </Card>

      <Card style={styles.card}>
        <SectionHeader title="Акаунт" />
        <InfoRow label="Авторизація" value={profile?.authProvider === 'backend' ? 'Backend API' : 'Локальний режим'} />
        <InfoRow label="Email" value={profile?.email ?? '-'} />
      </Card>
    </Screen>
  );
}

type InfoRowProps = {
  label: string;
  value: string;
};

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text numberOfLines={1} style={styles.infoValue}>
        {value}
      </Text>
    </View>
  );
}
