import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  getUserProfile,
  hasProfileErrors,
  updateUserProfile,
  validateProfile,
  type UserProfile,
} from '@/services/auth-service';

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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      async function loadProfile() {
        const storedProfile = await getUserProfile();
        if (!isMounted) return;

        if (!storedProfile) {
          router.replace('/');
          return;
        }

        setProfile(storedProfile);
        setName(storedProfile.name);
        setEmail(storedProfile.email);
      }

      loadProfile();
      return () => {
        isMounted = false;
      };
    }, [router])
  );

  const errors = useMemo(() => validateProfile({ email, name }), [email, name]);
  const canSave = !hasProfileErrors(errors) && !isSaving;

  const saveProfile = async () => {
    if (!canSave) return;

    setIsSaving(true);
    setMessage('Зберігаємо...');
    try {
      const nextProfile = await updateUserProfile({ email, name });
      setProfile(nextProfile);
      setMessage('Профіль оновлено.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Не вдалося оновити профіль.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backButton, pressed && styles.buttonPressed]}>
          <Text style={styles.backButtonText}>Назад</Text>
        </Pressable>

        <View style={styles.header}>
          <Text style={styles.eyebrow}>Профіль</Text>
          <Text style={styles.title}>{profile?.name ?? 'QuestMe'}</Text>
          <Text style={styles.subtitle}>
            {profile ? `Створено ${formatDate(profile.createdAt)}` : 'Завантажуємо профіль.'}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Авторизація</Text>
            <Text style={styles.metaValue}>{profile?.authProvider === 'backend' ? 'Backend API' : 'Локальний режим'}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Email</Text>
            <Text style={styles.metaValue}>{profile?.email ?? '-'}</Text>
          </View>
        </View>

        <View style={styles.form}>
          <Field
            error={errors.name}
            label="Імʼя"
            onChangeText={setName}
            placeholder="Ваше імʼя"
            value={name}
          />
          <Field
            autoCapitalize="none"
            error={errors.email}
            inputMode="email"
            keyboardType="email-address"
            label="Email"
            onChangeText={setEmail}
            placeholder="you@example.com"
            value={email}
          />

          {message ? (
            <Text accessibilityLiveRegion="polite" style={styles.message}>
              {message}
            </Text>
          ) : null}

          <Pressable
            accessibilityRole="button"
            disabled={!canSave}
            onPress={saveProfile}
            style={({ pressed }) => [
              styles.primaryButton,
              !canSave && styles.buttonDisabled,
              pressed && canSave && styles.buttonPressed,
            ]}>
            <Text style={styles.primaryButtonText}>{isSaving ? 'Зберігаємо...' : 'Зберегти'}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type FieldProps = React.ComponentProps<typeof TextInput> & {
  error?: string;
  label: string;
};

function Field({ error, label, ...inputProps }: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor="#858C99"
        style={[styles.input, Boolean(error) && styles.inputError]}
        {...inputProps}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F4F0EA',
  },
  content: {
    gap: 24,
    paddingHorizontal: 24,
    paddingVertical: 28,
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
  metaRow: {
    gap: 12,
  },
  metaItem: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D6D0C8',
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
    padding: 16,
  },
  metaLabel: {
    color: '#59616F',
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  metaValue: {
    color: '#171B22',
    fontSize: 16,
    fontWeight: '800',
  },
  form: {
    gap: 16,
  },
  field: {
    gap: 8,
  },
  label: {
    color: '#242A33',
    fontSize: 15,
    fontWeight: '800',
  },
  input: {
    minHeight: 56,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D6D0C8',
    backgroundColor: '#FFFFFF',
    color: '#171B22',
    fontSize: 17,
    paddingHorizontal: 16,
  },
  inputError: {
    borderColor: '#C44949',
  },
  errorText: {
    color: '#B33A3A',
    fontSize: 13,
    lineHeight: 18,
  },
  message: {
    color: '#59616F',
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#2D6A5F',
    borderRadius: 16,
    justifyContent: 'center',
    minHeight: 58,
  },
  buttonDisabled: {
    backgroundColor: '#9BA29B',
  },
  buttonPressed: {
    opacity: 0.78,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
  },
});
