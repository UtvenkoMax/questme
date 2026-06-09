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

import { registerStyles as styles } from './register-screen.styles';

type RegisterScreenViewProps = {
  canSubmit: boolean;
  email: string;
  isSubmitting: boolean;
  name: string;
  onBack: () => void;
  onChangeEmail: (value: string) => void;
  onChangeName: (value: string) => void;
  onChangePassword: (value: string) => void;
  onSubmit: () => void;
  password: string;
};

export function RegisterScreenView({
  canSubmit,
  email,
  isSubmitting,
  name,
  onBack,
  onChangeEmail,
  onChangeName,
  onChangePassword,
  onSubmit,
  password,
}: RegisterScreenViewProps) {
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
            <Text style={styles.title}>Реєстрація</Text>
            <Text style={styles.subtitle}>Створіть профіль, щоб продовжити.</Text>
          </View>

          <View style={styles.form}>
            <RegisterField
              autoCapitalize="words"
              autoComplete="name"
              label="Ім'я"
              onChangeText={onChangeName}
              placeholder="Ваше ім'я"
              textContentType="name"
              value={name}
            />
            <RegisterField
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
            <RegisterField
              autoCapitalize="none"
              autoComplete="new-password"
              label="Пароль"
              onChangeText={onChangePassword}
              placeholder="Мінімум 6 символів"
              secureTextEntry
              textContentType="newPassword"
              value={password}
            />

            <Pressable
              disabled={!canSubmit}
              onPress={onSubmit}
              style={({ pressed }) => [
                styles.submitButton,
                !canSubmit && styles.submitButtonDisabled,
                pressed && canSubmit && styles.submitButtonPressed,
              ]}>
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Зберігаємо...' : 'Зареєструватися'}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type RegisterFieldProps = React.ComponentProps<typeof TextInput> & {
  label: string;
};

function RegisterField({ label, ...inputProps }: RegisterFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor="#858C99"
        style={styles.input}
        {...inputProps}
      />
    </View>
  );
}
