import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

import { authenticateWithBiometrics } from '@/components/auth/biometric-auth';
import { PinCodeScreenView } from '@/components/auth/pin-code-screen-view';
import { PIN_LENGTH, type PinCodeStep } from '@/components/auth/pin-code.types';
import { clearPendingRegistration, savePin, setBiometricEnabled, verifyPin } from '@/services/auth-service';

type PinMode = 'create' | 'change' | 'reset';

function getPinMode(mode: string | string[] | undefined): PinMode {
  const value = Array.isArray(mode) ? mode[0] : mode;
  if (value === 'change' || value === 'reset') return value;
  return 'create';
}

function getInitialMessage(mode: PinMode) {
  if (mode === 'change') return 'Введіть поточний PIN-код.';
  if (mode === 'reset') return 'Створіть новий PIN-код для входу.';
  return 'Створіть PIN-код для швидкого входу.';
}

export default function PinCodeScreen() {
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode?: string | string[] }>();
  const pinMode = getPinMode(mode);
  const [step, setStep] = useState<PinCodeStep>(() => (pinMode === 'change' ? 'verify' : 'create'));
  const [pin, setPin] = useState('');
  const [firstPin, setFirstPin] = useState('');
  const [message, setMessage] = useState(() => getInitialMessage(pinMode));
  const [isBusy, setIsBusy] = useState(false);

  const title = useMemo(() => {
    if (step === 'biometric') return 'Безпечний вхід';
    if (step === 'done') return 'Готово';
    if (step === 'verify') return 'Зміна PIN';
    if (pinMode === 'reset') return 'Скидання PIN';
    return 'PIN-код';
  }, [pinMode, step]);

  const requestBiometric = useCallback(async () => {
    setIsBusy(true);
    setMessage('Підтвердьте біометричну автентифікацію у системному вікні.');

    try {
      const result = await authenticateWithBiometrics();

      if (result.success) {
        await setBiometricEnabled(true);
        setStep('done');
        setMessage(`${result.biometricName} увімкнено для входу в QuestMe.`);
        return;
      }

      await setBiometricEnabled(false);
      setMessage(result.message);
    } finally {
      setIsBusy(false);
    }
  }, []);

  const skipBiometric = useCallback(async () => {
    await setBiometricEnabled(false);
    setStep('done');
    setMessage('PIN-код збережено. Біометричний вхід можна увімкнути пізніше в налаштуваннях безпеки.');
  }, []);

  const completePin = useCallback(
    async (nextPin: string) => {
      if (step === 'verify') {
        setIsBusy(true);
        try {
          const isValid = await verifyPin(nextPin);
          setPin('');

          if (!isValid) {
            setMessage('PIN-код не збігається. Спробуйте ще раз.');
            return;
          }

          setStep('create');
          setMessage('Введіть новий PIN-код.');
          return;
        } finally {
          setIsBusy(false);
        }
      }

      if (step === 'create') {
        setFirstPin(nextPin);
        setPin('');
        setStep('confirm');
        setMessage('Повторіть PIN-код для підтвердження.');
        return;
      }

      if (nextPin !== firstPin) {
        setFirstPin('');
        setPin('');
        setStep('create');
        setMessage('PIN-коди не збігаються. Спробуйте ще раз.');
        return;
      }

      setIsBusy(true);
      try {
        await savePin(nextPin);
        await clearPendingRegistration();
        setPin('');

        if (pinMode === 'create') {
          setStep('biometric');
          setMessage('PIN-код збережено. Налаштуйте біометричний вхід для швидкої авторизації.');
          setTimeout(requestBiometric, 260);
          return;
        }

        setStep('done');
        setMessage(pinMode === 'reset' ? 'PIN-код скинуто. Тепер увійдіть з новим PIN.' : 'PIN-код оновлено.');
      } finally {
        setIsBusy(false);
      }
    },
    [firstPin, pinMode, requestBiometric, step]
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

  const finish = useCallback(() => {
    if (pinMode === 'create') {
      router.replace('/quests' as never);
      return;
    }

    if (pinMode === 'reset') {
      router.replace('/login');
      return;
    }

    router.replace('/security');
  }, [pinMode, router]);

  return (
    <PinCodeScreenView
      biometricRetryLabel="Спробувати ще раз"
      cancelLabel={pin.length > 0 ? 'Очистити' : 'Назад'}
      isBusy={isBusy}
      message={message}
      onCancel={cancelPin}
      onFinish={finish}
      onPressDigit={pressDigit}
      onRetryBiometric={requestBiometric}
      onSkipBiometric={pinMode === 'create' ? skipBiometric : undefined}
      pinLength={pin.length}
      step={step}
      title={title}
    />
  );
}
