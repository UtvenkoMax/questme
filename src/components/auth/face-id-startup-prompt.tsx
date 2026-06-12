import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useRef } from 'react';
import { Alert, AppState, type AppStateStatus } from 'react-native';

import {
  BIOMETRIC_ENABLED_KEY,
  FACE_ID_ENABLED_KEY,
  PIN_KEY,
  getExpoGoFaceIdMessage,
  getFaceIdSetupMessage,
  isExpoGoOnIos,
  isIphone,
  supportsFaceId,
} from './biometric-auth';

export function FaceIdStartupPrompt() {
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const promptInFlight = useRef(false);
  const promptedInActiveSession = useRef(false);

  const enableFaceId = useCallback(async () => {
    const result = await LocalAuthentication.authenticateAsync({
      cancelLabel: 'Скасувати',
      disableDeviceFallback: true,
      fallbackLabel: '',
      promptMessage: 'Підтвердьте Face ID для QuestMe',
    });

    if (result.success) {
      await Promise.all([
        SecureStore.setItemAsync(FACE_ID_ENABLED_KEY, 'true'),
        SecureStore.setItemAsync(BIOMETRIC_ENABLED_KEY, 'true'),
      ]);
    }
  }, []);

  const showSetupAlert = useCallback(() => {
    Alert.alert(
      'Увімкнути Face ID для входу?',
      'Підтвердіть Face ID, щоб надалі входити в QuestMe швидше та безпечніше.',
      [
        {
          text: 'Пізніше',
          style: 'cancel',
        },
        {
          text: 'Увімкнути Face ID',
          onPress: () => {
            enableFaceId();
          },
        },
      ]
    );
  }, [enableFaceId]);

  const showEnrollmentAlert = useCallback(() => {
    Alert.alert(
      'Face ID не налаштовано',
      getFaceIdSetupMessage(),
      [
        {
          text: 'Зрозуміло',
          style: 'cancel',
        },
      ]
    );
  }, []);

  const showExpoGoAlert = useCallback(() => {
    Alert.alert('Face ID недоступний в Expo Go', getExpoGoFaceIdMessage(), [
      {
        text: 'Зрозуміло',
        style: 'cancel',
      },
    ]);
  }, []);

  const maybePromptForFaceId = useCallback(async () => {
    if (!isIphone() || promptInFlight.current) return;

    promptInFlight.current = true;
    try {
      const [pin, faceIdEnabled] = await Promise.all([
        SecureStore.getItemAsync(PIN_KEY),
        SecureStore.getItemAsync(FACE_ID_ENABLED_KEY),
      ]);

      if (!pin || faceIdEnabled === 'true' || promptedInActiveSession.current) return;

      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

      if (!supportsFaceId(supportedTypes)) return;

      promptedInActiveSession.current = true;

      if (isExpoGoOnIos()) {
        showExpoGoAlert();
        return;
      }

      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (isEnrolled) {
        showSetupAlert();
        return;
      }

      showEnrollmentAlert();
    } finally {
      promptInFlight.current = false;
    }
  }, [showEnrollmentAlert, showExpoGoAlert, showSetupAlert]);

  useEffect(() => {
    const timer = setTimeout(maybePromptForFaceId, 900);
    const subscription = AppState.addEventListener('change', (nextState) => {
      const wasInactive = appState.current === 'inactive' || appState.current === 'background';
      appState.current = nextState;

      if (nextState === 'active' && wasInactive) {
        promptedInActiveSession.current = false;
        setTimeout(maybePromptForFaceId, 500);
      }
    });

    return () => {
      clearTimeout(timer);
      subscription.remove();
    };
  }, [maybePromptForFaceId]);

  return null;
}
