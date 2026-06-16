import { Pressable, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { ConfettiBurst } from '@/components/ui/confetti';
import { PageHeader } from '@/components/ui/layout';
import { Screen } from '@/components/ui/screen';
import { Notice } from '@/components/ui/status';
import { TextField } from '@/components/ui/text-field';
import type { PasswordStrength, RegistrationErrors } from '@/services/auth-service';
import { styles } from './register-screen-view.styles';

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
  showConfetti: boolean;
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
  showConfetti,
  showPassword,
  submitError,
}: RegisterScreenViewProps) {
  return (
    <Screen contentStyle={styles.content} keyboard>
      <ConfettiBurst active={showConfetti} />

      <PageHeader
        eyebrow="QuestMe"
        subtitle="Створіть профіль, а потім додайте PIN для швидкого й безпечного входу."
        title="Реєстрація"
      />

      <View style={styles.form}>
        <TextField
          autoCapitalize="words"
          autoComplete="name"
          error={errors.name}
          label="Імʼя"
          onChangeText={onChangeName}
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
          onChangeText={onChangeEmail}
          placeholder="you@example.com"
          textContentType="emailAddress"
          value={email}
        />
        <TextField
          autoCapitalize="none"
          autoComplete="new-password"
          error={errors.password}
          label="Пароль"
          onChangeText={onChangePassword}
          placeholder="Мінімум 8 символів"
          rightAction={
            <Pressable
              accessibilityLabel={showPassword ? 'Приховати пароль' : 'Показати пароль'}
              accessibilityRole="button"
              onPress={onTogglePasswordVisibility}
              style={({ pressed }) => [styles.inlineButton, pressed && styles.inlineButtonPressed]}>
              <Text style={styles.inlineButtonText}>{showPassword ? 'Приховати' : 'Показати'}</Text>
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
                  passwordStrength.score === 3 && index < passwordStrength.score && styles.strengthBarStrong,
                ]}
              />
            ))}
          </View>
          <Text style={styles.helperText}>{passwordStrength.label}</Text>
        </View>

        {submitError ? <Notice tone="danger">{submitError}</Notice> : null}

        <View style={styles.submitWrapper}>
          <Button disabled={!canSubmit} icon="user-plus" loading={isSubmitting} onPress={onSubmit} title="Створити профіль" />
        </View>
      </View>
    </Screen>
  );
}
