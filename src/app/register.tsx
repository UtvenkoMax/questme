import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';

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
      await SecureStore.setItemAsync(
        'questme.registration',
        JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          createdAt: new Date().toISOString(),
        })
      );
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
