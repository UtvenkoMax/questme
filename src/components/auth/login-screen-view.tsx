import type { ComponentProps } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { loginStyles as styles } from './login-screen.styles';

type LoginScreenViewProps = {
  canSubmit: boolean;
  email: string;
  errorMessage: string;
  isSubmitting: boolean;
  onBack: () => void;
  onChangeEmail: (value: string) => void;
  onChangePassword: (value: string) => void;
  onRegister: () => void;
  onSubmit: () => void;
  password: string;
};

export function LoginScreenView({
  canSubmit,
  email,
  errorMessage,
  isSubmitting,
  onBack,
  onChangeEmail,
  onChangePassword,
  onRegister,
  onSubmit,
  password,
}: LoginScreenViewProps) {
  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>Назад</Text>
          </Pressable>

          <View style={styles.header}>
            <Text style={styles.eyebrow}>QuestMe</Text>
            <Text style={styles.title}>Вхід</Text>
            <Text style={styles.subtitle}>Увійдіть у свій профіль, щоб продовжити.</Text>
          </View>

          <View style={styles.form}>
            <LoginField
              autoCapitalize="none"
              autoComplete="email"
              inputMode="email"
              keyboardType="email-address"
              label="Email"
              onChangeText={onChangeEmail}
              placeholder="you@example.com"
              textContentType="emailAddress"
              value={email}
            />
            <LoginField
              autoCapitalize="none"
              autoComplete="current-password"
              label="Пароль"
              onChangeText={onChangePassword}
              placeholder="Ваш пароль"
              secureTextEntry
              textContentType="password"
              value={password}
            />

            {errorMessage.length > 0 && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}

            <Pressable
              disabled={!canSubmit}
              onPress={onSubmit}
              style={({ pressed }) => [
                styles.submitButton,
                !canSubmit && styles.submitButtonDisabled,
                pressed && canSubmit && styles.submitButtonPressed,
              ]}>
              <Text style={styles.submitButtonText}>{isSubmitting ? 'Перевіряємо...' : 'Увійти'}</Text>
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Ще немає профілю?</Text>
            <Pressable
              onPress={onRegister}
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.secondaryButtonPressed,
              ]}>
              <Text style={styles.secondaryButtonText}>Зареєструватися</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type LoginFieldProps = ComponentProps<typeof TextInput> & {
  label: string;
};

function LoginField({ label, ...inputProps }: LoginFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput placeholderTextColor="#858C99" style={styles.input} {...inputProps} />
    </View>
  );
}
