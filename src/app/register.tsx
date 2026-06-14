import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';

import {
  REGISTRATION_KEY,
  SESSION_KEY,
  normalizeEmail,
  setAuthItem,
  type RegistrationRecord,
  type SessionRecord,
} from '@/components/auth/auth-storage';
import { RegisterScreenView } from '@/components/auth/register-screen-view';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(
    () => name.trim().length > 1 && email.includes('@') && password.length >= 6 && !isSubmitting,
    [email, isSubmitting, name, password]
  );

  const submit = async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);
    try {
      const createdAt = new Date().toISOString();
      const registration: RegistrationRecord = {
        name: name.trim(),
        email: normalizeEmail(email),
        password,
        createdAt,
      };
      const session: SessionRecord = {
        name: registration.name,
        email: registration.email,
        loggedInAt: createdAt,
      };

      await Promise.all([
        setAuthItem(REGISTRATION_KEY, JSON.stringify(registration)),
        setAuthItem(SESSION_KEY, JSON.stringify(session)),
      ]);
      router.push('/pin-code');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RegisterScreenView
      canSubmit={canSubmit}
      email={email}
      isSubmitting={isSubmitting}
      name={name}
      onBack={router.back}
      onChangeEmail={setEmail}
      onChangeName={setName}
      onChangePassword={setPassword}
      onSubmit={submit}
      password={password}
    />
  );
}
