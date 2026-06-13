import { useMemo } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { PasswordStrength, RegistrationErrors } from '@/services/auth-service';
import { getResponsiveMetrics } from '@/utils/responsive';

import { registerStyles as styles } from './register-screen.styles';

type RegisterScreenViewProps = {
  canSubmit: boolean;
  email: string;
  errors: RegistrationErrors;
  isSubmitting: boolean;
  name: string;
  onBack: () => void;
  onChangeEmail: (value: string) => void;
  onChangeName: (value: string) => void;
  onChangePassword: (value: string) => void;
  onTogglePasswordVisibility: () => void;
  onSubmit: () => void;
  password: string;
  passwordStrength: PasswordStrength;
  showPassword: boolean;
  submitError: string;
};

export function RegisterScreenView({
  canSubmit,
  email,
  errors,
  isSubmitting,
  name,
  onBack,
  onChangeEmail,
  onChangeName,
  onChangePassword,
  onTogglePasswordVisibility,
  onSubmit,
  password,
  passwordStrength,
  showPassword,
  submitError,
}: RegisterScreenViewProps) {
  const { height, width } = useWindowDimensions();
  const layout = useMemo(() => getResponsiveMetrics(width, height), [height, width]);
  const compact = layout.isCompactHeight || layout.isCompactWidth;

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
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
          <Pressable onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>РќР°Р·Р°Рґ</Text>
          </Pressable>

          <View style={[styles.header, compact && styles.headerCompact]}>
            <Text style={styles.eyebrow}>QuestMe</Text>
            <Text style={[styles.title, compact && styles.titleCompact]}>Р РµС”СЃС‚СЂР°С†С–СЏ</Text>
            <Text style={[styles.subtitle, compact && styles.subtitleCompact]}>
              РЎС‚РІРѕСЂС–С‚СЊ РїСЂРѕС„С–Р»СЊ, С‰РѕР± РїСЂРѕРґРѕРІР¶РёС‚Рё.
            </Text>
          </View>

          <View style={styles.form}>
            <RegisterField
              autoCapitalize="words"
              autoComplete="name"
              error={errors.name}
              label="Р†Рј'СЏ"
              onChangeText={onChangeName}
              placeholder="Р’Р°С€Рµ С–Рј'СЏ"
              textContentType="name"
              value={name}
            />
            <RegisterField
              autoCapitalize="none"
              autoComplete="email"
              inputMode="email"
              keyboardType="email-address"
              error={errors.email}
              label="Email"
              onChangeText={onChangeEmail}
              placeholder="you@example.com"
              textContentType="emailAddress"
              value={email}
            />
            <RegisterField
              autoCapitalize="none"
              autoComplete="new-password"
              error={errors.password}
              label="РџР°СЂРѕР»СЊ"
              onChangeText={onChangePassword}
              placeholder="РњС–РЅС–РјСѓРј 6 СЃРёРјРІРѕР»С–РІ"
              rightAction={
                <Pressable
                  accessibilityLabel={showPassword ? 'РџСЂРёС…РѕРІР°С‚Рё РїР°СЂРѕР»СЊ' : 'РџРѕРєР°Р·Р°С‚Рё РїР°СЂРѕР»СЊ'}
                  accessibilityRole="button"
                  onPress={onTogglePasswordVisibility}
                  style={({ pressed }) => [styles.inlineButton, pressed && styles.inlineButtonPressed]}
                >
                  <Text style={styles.inlineButtonText}>{showPassword ? 'РџСЂРёС…РѕРІР°С‚Рё' : 'РџРѕРєР°Р·Р°С‚Рё'}</Text>
                </Pressable>
              }
              secureTextEntry={!showPassword}
              textContentType="newPassword"
              value={password}
            />

            <View accessibilityLabel={passwordStrength.label} style={styles.passwordStrength}>
              <View style={styles.strengthBars}>
                {[0, 1, 2].map((index) => (
                  <View
                    key={index}
                    style={[
                      styles.strengthBar,
                      index < passwordStrength.score && styles.strengthBarActive,
                    ]}
                  />
                ))}
              </View>
              <Text style={styles.helperText}>{passwordStrength.label}</Text>
            </View>

            {submitError ? <Text style={styles.submitError}>{submitError}</Text> : null}

            <Pressable
              accessibilityRole="button"
              disabled={!canSubmit}
              onPress={onSubmit}
              style={({ pressed }) => [
                styles.submitButton,
                !canSubmit && styles.submitButtonDisabled,
                pressed && canSubmit && styles.submitButtonPressed,
              ]}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Р—Р±РµСЂС–РіР°С”РјРѕ...' : 'Р—Р°СЂРµС”СЃС‚СЂСѓРІР°С‚РёСЃСЏ'}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type RegisterFieldProps = React.ComponentProps<typeof TextInput> & {
  error?: string;
  label: string;
  rightAction?: React.ReactNode;
};

function RegisterField({ error, label, rightAction, ...inputProps }: RegisterFieldProps) {
  return (
    <View style={styles.field}>
      <View style={styles.fieldHeader}>
        <Text style={styles.label}>{label}</Text>
        {rightAction}
      </View>
      <TextInput
        placeholderTextColor="#858C99"
        style={[styles.input, Boolean(error) && styles.inputError]}
        {...inputProps}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}
