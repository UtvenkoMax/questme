import { Eye, EyeSlash } from "phosphor-react-native";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AuthInput } from "@/components/auth/AuthInput";
import { StepIndicator } from "@/components/auth/StepIndicator";
import { ChaosButton } from "@/components/ui/chaos";
import { ConfettiBurst } from "@/components/ui/confetti";
import { Screen } from "@/components/ui/screen";
import { questColors } from "@/constants/colors";
import { radii, spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import type {
    PasswordStrength,
    RegistrationErrors,
} from "@/services/auth-service";

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
  const [step, setStep] = useState(0);
  const isLast = step === 2;

  const stepError = useMemo(() => {
    if (step === 0) return errors.name;
    if (step === 1) return errors.email;
    return errors.password;
  }, [errors.email, errors.name, errors.password, step]);

  const canGoNext = useMemo(() => {
    if (step === 0) return name.trim().length >= 2 && !errors.name;
    if (step === 1) return email.trim().length > 4 && !errors.email;
    return canSubmit;
  }, [canSubmit, email, errors.email, errors.name, name, step]);

  const goNext = () => {
    if (!canGoNext) return;
    if (isLast) {
      onSubmit();
      return;
    }
    setStep((value) => value + 1);
  };

  const goBack = () => {
    if (step === 0) {
      onBack();
      return;
    }
    setStep((value) => value - 1);
  };

  return (
    <Screen contentStyle={styles.content} keyboard scroll={false}>
      <ConfettiBurst active={showConfetti} />
      <View style={styles.particles}>
        {Array.from({ length: 18 }, (_, index) => (
          <View
            key={index}
            style={[
              styles.particle,
              { left: `${(index * 29) % 94}%`, top: `${(index * 47) % 88}%` },
            ]}
          />
        ))}
      </View>

      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.kicker}>AUTH SEQUENCE</Text>
          <Text style={styles.title}>
            {step === 0
              ? "Як тебе називати?"
              : step === 1
                ? "Куди надсилати оплату?"
                : "Захисти профіль."}
          </Text>
          <Text style={styles.subtitle}>
            {step === 0
              ? "Один крок за раз. QuestMe не любить нудні форми."
              : step === 1
                ? "Email потрібен для відновлення доступу та платіжних квитанцій."
                : "Пароль лишається локальним, PIN налаштуємо після створення профілю."}
          </Text>
        </View>

        <StepIndicator count={3} index={step} />

        {step === 0 ? (
          <AuthInput
            autoCapitalize="words"
            autoComplete="name"
            helper={stepError}
            label="Username"
            onChangeText={onChangeName}
            placeholder="Наприклад: max"
            textContentType="name"
            value={name}
          />
        ) : null}

        {step === 1 ? (
          <AuthInput
            autoCapitalize="none"
            autoComplete="email"
            helper={stepError}
            inputMode="email"
            keyboardType="email-address"
            label="Email"
            onChangeText={onChangeEmail}
            placeholder="you@example.com"
            textContentType="emailAddress"
            value={email}
          />
        ) : null}

        {step === 2 ? (
          <View style={styles.passwordBlock}>
            <AuthInput
              autoCapitalize="none"
              autoComplete="new-password"
              helper={stepError || passwordStrength.label}
              label="Password"
              onChangeText={onChangePassword}
              placeholder="Мінімум 8 символів"
              secureTextEntry={!showPassword}
              textContentType="newPassword"
              value={password}
            />
            <Pressable
              accessibilityRole="button"
              onPress={onTogglePasswordVisibility}
              style={styles.eyeButton}
            >
              {showPassword ? (
                <EyeSlash color={questColors.textPrimary} size={18} />
              ) : (
                <Eye color={questColors.textPrimary} size={18} />
              )}
              <Text style={styles.eyeText}>
                {showPassword ? "Приховати" : "Показати"}
              </Text>
            </Pressable>
            <View style={styles.strengthBars}>
              {[0, 1, 2].map((bar) => (
                <View
                  key={bar}
                  style={[
                    styles.strengthBar,
                    bar < passwordStrength.score && styles.strengthActive,
                    passwordStrength.score === 3 &&
                      bar < passwordStrength.score &&
                      styles.strengthStrong,
                  ]}
                />
              ))}
            </View>
          </View>
        ) : null}

        {submitError ? <Text style={styles.error}>{submitError}</Text> : null}

        <View style={styles.actions}>
          <ChaosButton
            label="Назад"
            onPress={goBack}
            style={styles.actionButton}
            variant="outline"
          />
          <ChaosButton
            label={
              isLast
                ? isSubmitting
                  ? "Створюємо..."
                  : "Створити профіль"
                : "Далі"
            }
            onPress={goNext}
            style={styles.actionButton}
            variant={canGoNext ? "ember" : "ghost"}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    flex: 1,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  card: {
    backgroundColor: "rgba(17,17,24,0.88)",
    borderColor: questColors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    gap: spacing.lg,
    padding: spacing.lg,
  },
  content: {
    justifyContent: "center",
    paddingBottom: spacing.xl,
    paddingTop: spacing.xl,
  },
  error: {
    ...typography.captionStrong,
    color: questColors.ember,
  },
  eyeButton: {
    alignItems: "center",
    alignSelf: "flex-start",
    flexDirection: "row",
    gap: spacing.xs,
    paddingVertical: spacing.xs,
  },
  eyeText: {
    ...typography.captionStrong,
    color: questColors.textPrimary,
  },
  header: {
    gap: spacing.sm,
  },
  kicker: {
    ...typography.eyebrow,
    color: questColors.acid,
  },
  particle: {
    backgroundColor: questColors.electric,
    borderRadius: radii.pill,
    height: 2,
    opacity: 0.26,
    position: "absolute",
    width: 2,
  },
  particles: {
    ...StyleSheet.absoluteFillObject,
  },
  passwordBlock: {
    gap: spacing.sm,
  },
  strengthActive: {
    backgroundColor: questColors.ember,
  },
  strengthBar: {
    backgroundColor: questColors.border,
    borderRadius: radii.pill,
    flex: 1,
    height: 7,
  },
  strengthBars: {
    flexDirection: "row",
    gap: spacing.xs,
  },
  strengthStrong: {
    backgroundColor: questColors.acid,
  },
  subtitle: {
    ...typography.body,
    color: questColors.textSecondary,
  },
  title: {
    ...typography.title,
    color: questColors.textPrimary,
  },
});
