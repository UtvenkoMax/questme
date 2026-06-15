import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Metric, PageHeader, SectionHeader } from '@/components/ui/layout';
import { Screen } from '@/components/ui/screen';
import { LoadingState, Notice } from '@/components/ui/status';
import { TextField } from '@/components/ui/text-field';
import {
  getUserProfile,
  hasProfileErrors,
  updateUserProfile,
  validateProfile,
  type UserProfile,
} from '@/services/auth-service';
import { getQuestProgress, getQuests, type Quest } from '@/services/quest-service';
import { colors, spacing, typography } from '@/theme';

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
  const [message, setMessage] = useState<{ text: string; tone: 'success' | 'danger' | 'neutral' } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      async function loadProfile() {
        setIsLoading(true);
        const [storedProfile, storedQuests] = await Promise.all([getUserProfile(), getQuests()]);
        if (!isMounted) return;

        if (!storedProfile) {
          router.replace('/');
          return;
        }

        setProfile(storedProfile);
        setName(storedProfile.name);
        setEmail(storedProfile.email);
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
  const canSave = !hasProfileErrors(errors) && !isSaving;

  const saveProfile = async () => {
    if (!canSave) return;

    setIsSaving(true);
    setMessage(null);

    try {
      const nextProfile = await updateUserProfile({ email, name });
      setProfile(nextProfile);
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
        action={<Button fullWidth={false} icon="shield" onPress={() => router.push('/security')} size="sm" title="Безпека" variant="ghost" />}
        eyebrow="Профіль"
        subtitle={profile ? `Створено ${formatDate(profile.createdAt)}` : 'Ваш локальний профіль QuestMe.'}
        title={profile?.name ?? 'QuestMe'}
      />

      <View style={styles.metrics}>
        <Metric label="Виконано" value={`${progress.completedCount}/${progress.totalCount}`} />
        <Metric label="Балів" value={progress.totalPoints} />
        <Metric label="Прогрес" value={`${progress.completionPercent}%`} />
      </View>

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

import { styles } from './profile.styles';
