import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

import { BIOMETRIC_ENABLED_KEY, FACE_ID_ENABLED_KEY, getBiometricName, getExpoGoFaceIdMessage, getFaceIdSetupMessage, isExpoGoOnIos, isIphone, supportsFaceId } from '@/components/auth/biometric-auth';
import { PinCodeScreenView } from '@/components/auth/pin-code-screen-view';
import { PIN_LENGTH, type PinCodeStep } from '@/components/auth/pin-code.types';

export default function PinCodeScreen() {
  const router = useRouter();
  const [step, setStep] = useState<PinCodeStep>('create');
  const [pin, setPin] = useState('');
  const [firstPin, setFirstPin] = useState('');
  const [message, setMessage] = useState('Create a passcode');
  const [isBusy, setIsBusy] = useState(false);

  const title = useMemo(
    () => (step === 'biometric' ? 'Безпечний вхід' : step === 'done' ? 'Готово' : 'Enter Passcode'),
    [step]
  );

  const requestBiometric = useCallback(async () => {
    setIsBusy(true);
    setMessage('Підтвердьте біометричну автентифікацію у системному вікні.');

    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
      const biometricName = getBiometricName(supportedTypes);

      if (!hasHardware) {
        setMessage('Цей пристрій не підтримує біометричну автентифікацію.');
        return;
      }

      if (isExpoGoOnIos() && supportsFaceId(supportedTypes)) {
        setMessage(getExpoGoFaceIdMessage());
        return;
      }

      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        setMessage(isIphone() ? getFaceIdSetupMessage() : `Налаштуйте ${biometricName} у системі.`);
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        biometricsSecurityLevel: 'strong',
        cancelLabel: 'Скасувати',
        disableDeviceFallback: true,
        fallbackLabel: '',
        promptDescription: `QuestMe використовує ${biometricName} лише для підтвердження входу.`,
        promptMessage: `Підтвердьте вхід через ${biometricName}`,
        promptSubtitle: 'Безпечний вхід у QuestMe',
      });

      if (result.success) {
        const writes = [SecureStore.setItemAsync(BIOMETRIC_ENABLED_KEY, 'true')];
        if (isIphone() && supportsFaceId(supportedTypes)) writes.push(SecureStore.setItemAsync(FACE_ID_ENABLED_KEY, 'true'));
        await Promise.all(writes);
        setStep('done');
        setMessage(`${biometricName} увімкнено для входу в QuestMe.`);
        return;
      }

      await SecureStore.setItemAsync(BIOMETRIC_ENABLED_KEY, 'false');
      setMessage(`${biometricName} не підтверджено. Спробуйте ще раз.`);
    } finally {
      setIsBusy(false);
    }
  }, []);

  const completePin = useCallback(
    async (nextPin: string) => {
      if (step === 'create') {
        setFirstPin(nextPin);
        setPin('');
        setStep('confirm');
        setMessage('Confirm your passcode');
        return;
      }

      if (nextPin !== firstPin) {
        setFirstPin('');
        setPin('');
        setStep('create');
        setMessage('Passcodes did not match. Try again.');
        return;
      }

      setIsBusy(true);
      try {
        await SecureStore.setItemAsync('questme.pin', nextPin, {
          keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
        });
        setPin('');
        setStep('biometric');
        setMessage('PIN-код збережено. Налаштуйте біометричний вхід для швидкої авторизації.');
        setTimeout(requestBiometric, 260);
      } finally {
        setIsBusy(false);
      }
    },
    [firstPin, requestBiometric, step]
  );

  const pressDigit = useCallback(
    (digit: string) => {
      if (isBusy || step === 'biometric' || step === 'done' || pin.length >= PIN_LENGTH) return;

      const nextPin = `${pin}${digit}`;
      setPin(nextPin);

      if (nextPin.length === PIN_LENGTH) {
        setTimeout(() => completePin(nextPin), 140);
      }
    },
    [completePin, isBusy, pin, step]
  );

  const cancelPin = useCallback(() => {
    if (pin.length > 0) {
      setPin('');
      return;
    }
    router.back();
  }, [pin.length, router]);

  return (
    <PinCodeScreenView
      isBusy={isBusy}
      message={message}
      onCancel={cancelPin}
      onFinish={() => router.replace('/')}
      onPressDigit={pressDigit}
      onRetryBiometric={requestBiometric}
      pinLength={pin.length}
      step={step}
      title={title}
    />
  );
}
