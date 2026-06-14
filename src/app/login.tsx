import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';

import {
  REGISTRATION_KEY,
  SESSION_KEY,
  getAuthItem,
  normalizeEmail,
  parseRegistrationRecord,
  setAuthItem,
  type SessionRecord,
} from '@/components/auth/auth-storage';
import { LoginScreenView } from '@/components/auth/login-screen-view';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getAuthItem(REGISTRATION_KEY)
      .then((value) => {
        const registration = parseRegistrationRecord(value);
        if (isMounted && registration) {
          setEmail(registration.email);
        }
      })
      .catch(() => undefined);

    return () => {
      isMounted = false;
    };
  }, []);

  const canSubmit = useMemo(
    () => normalizeEmail(email).includes('@') && password.length > 0 && !isSubmitting,
    [email, isSubmitting, password]
  );

  const submit = async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const registration = parseRegistrationRecord(await getAuthItem(REGISTRATION_KEY));

      if (!registration) {
        setErrorMessage('Спочатку створіть профіль.');
        return;
      }

      if (!registration.password) {
        setErrorMessage('Для цього профілю пароль ще не збережено. Створіть профіль ще раз.');
        return;
      }

      if (registration.email !== normalizeEmail(email) || registration.password !== password) {
        setErrorMessage('Невірний email або пароль.');
        return;
      }

      const session: SessionRecord = {
        email: registration.email,
        loggedInAt: new Date().toISOString(),
        name: registration.name,
      };

      await setAuthItem(SESSION_KEY, JSON.stringify(session));
      router.replace('/');
    } catch {
      setErrorMessage('Не вдалося увійти. Спробуйте ще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LoginScreenView
      canSubmit={canSubmit}
      email={email}
      errorMessage={errorMessage}
      isSubmitting={isSubmitting}
      onBack={router.back}
      onChangeEmail={setEmail}
      onChangePassword={setPassword}
      onRegister={() => router.replace('/register')}
      onSubmit={submit}
      password={password}
    />
  );
}
