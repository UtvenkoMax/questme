import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';

import { RegisterScreenView } from '@/components/auth/register-screen-view';
import {
  getPasswordStrength,
  hasRegistrationErrors,
  registerAccount,
  validateRegistration,
} from '@/services/auth-service';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const navigationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const errors = useMemo(() => validateRegistration({ email, name, password }), [email, name, password]);
  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);
  const canSubmit = useMemo(
    () => !hasRegistrationErrors(errors) && !isSubmitting && !showConfetti,
    [errors, isSubmitting, showConfetti]
  );

  useEffect(() => {
    return () => {
      if (navigationTimer.current) clearTimeout(navigationTimer.current);
    };
  }, []);

  const submit = async () => {
    if (showConfetti) return;

    const nextErrors = validateRegistration({ email, name, password });
    if (hasRegistrationErrors(nextErrors)) return;

    setIsSubmitting(true);
    setSubmitError('');
    try {
      await registerAccount({ email, name, password });
      setIsSubmitting(false);
      setShowConfetti(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});

      navigationTimer.current = setTimeout(() => {
        router.push('/pin-code');
      }, 1250);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Не вдалося створити профіль.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RegisterScreenView
      canSubmit={canSubmit}
      email={email}
      errors={errors}
      isSubmitting={isSubmitting}
      name={name}
      onBack={router.back}
      onChangeEmail={setEmail}
      onChangeName={setName}
      onChangePassword={setPassword}
      onTogglePasswordVisibility={() => setShowPassword((value) => !value)}
      onSubmit={submit}
      password={password}
      passwordStrength={passwordStrength}
      showConfetti={showConfetti}
      showPassword={showPassword}
      submitError={submitError}
    />
  );
}
