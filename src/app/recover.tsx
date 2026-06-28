import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PageHeader, SectionHeader } from '@/components/ui/layout';
import { Screen } from '@/components/ui/screen';
import { Notice } from '@/components/ui/status';
import { TextField } from '@/components/ui/text-field';
import { createRecoveryCode, verifyRecoveryCode } from '@/services/auth-service';
import { spacing } from '@/theme';

export default function RecoverScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [demoCode, setDemoCode] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; tone: 'danger' | 'success' | 'neutral' } | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const requestRecovery = async () => {
    setIsBusy(true);
    setMessage(null);

    try {
      const recoveryCode = await createRecoveryCode(email);
      if (!recoveryCode) {
        setDemoCode(null);
        setMessage({ text: 'Профіль із таким email не знайдено на цьому пристрої.', tone: 'danger' });
        return;
      }

      setDemoCode(recoveryCode);
      setMessage({
        text: 'Код відновлення створено. У локальному режимі проєкту він показаний прямо тут.',
        tone: 'success',
      });
    } finally {
      setIsBusy(false);
    }
  };

  const confirmRecovery = async () => {
    setIsBusy(true);
    setMessage(null);

    try {
      const isValid = await verifyRecoveryCode(email, code);
      if (!isValid) {
        setMessage({ text: 'Код недійсний або вже прострочений.', tone: 'danger' });
        return;
      }

      router.replace({ pathname: '/pin-code', params: { mode: 'reset' } });
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <Screen contentStyle={styles.content} keyboard>
      <Button fullWidth={false} icon="arrow-left" onPress={() => router.back()} size="sm" title="Назад" variant="ghost" />
      <PageHeader
        eyebrow="Recovery"
        subtitle="Підтвердьте email локального профілю, щоб відновити доступ і створити новий PIN."
        title="Відновлення акаунта"
      />

      <Card style={styles.card}>
        <SectionHeader
          subtitle="Код діє 10 хвилин. Для production потрібно підʼєднати backend email delivery."
          title="Код через email"
        />
        <TextField
          autoCapitalize="none"
          autoComplete="email"
          inputMode="email"
          keyboardType="email-address"
          label="Email профілю"
          onChangeText={setEmail}
          placeholder="you@example.com"
          textContentType="emailAddress"
          value={email}
        />
        <Button disabled={!email.trim() || isBusy} icon="mail" loading={isBusy && !demoCode} onPress={requestRecovery} title="Надіслати код" />
        {demoCode ? <Notice tone="neutral">Демо-код: {demoCode}</Notice> : null}
        <TextField
          inputMode="numeric"
          keyboardType="number-pad"
          label="Код відновлення"
          maxLength={6}
          onChangeText={setCode}
          placeholder="123456"
          value={code}
        />
        {message ? <Notice tone={message.tone}>{message.text}</Notice> : null}
        <Button disabled={code.trim().length !== 6 || isBusy} icon="check-circle" loading={isBusy && Boolean(demoCode)} onPress={confirmRecovery} title="Підтвердити й змінити PIN" />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.lg,
  },
  content: {
    gap: spacing.xl,
  },
});
