import Constants from 'expo-constants';
import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';

import { STORAGE_KEYS } from '@/services/auth-service';

export const BIOMETRIC_ENABLED_KEY = STORAGE_KEYS.biometricEnabled;
export const FACE_ID_ENABLED_KEY = STORAGE_KEYS.faceIdEnabled;
export const PIN_KEY = STORAGE_KEYS.pin;

type AuthenticateWithBiometricsOptions = {
  promptMessage?: string;
};

export function isIphone() {
  return Platform.OS === 'ios' && !Platform.isPad;
}

export function isExpoGoOnIos() {
  return Platform.OS === 'ios' && Constants.appOwnership === 'expo';
}

export function supportsFaceId(types: LocalAuthentication.AuthenticationType[]) {
  return types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION);
}

export function getBiometricName(types: LocalAuthentication.AuthenticationType[]) {
  if (isIphone() && supportsFaceId(types)) return 'Face ID';
  if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) return 'відбиток пальця';
  if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
    return 'розпізнавання обличчя';
  }
  return 'біометричну автентифікацію';
}

export function getExpoGoFaceIdMessage() {
  return 'Face ID не працює в Expo Go на iOS. Для перевірки Face ID потрібен development build.';
}

export function getFaceIdSetupMessage() {
  return 'Face ID ще не налаштовано на цьому iPhone. Додайте його в Settings → Face ID & Passcode, потім поверніться в QuestMe.';
}

export async function authenticateWithBiometrics(options: AuthenticateWithBiometricsOptions = {}) {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
  const biometricName = getBiometricName(supportedTypes);

  if (!hasHardware) {
    return {
      biometricName,
      message: 'Цей пристрій не підтримує біометричну автентифікацію.',
      success: false,
    };
  }

  if (isExpoGoOnIos() && supportsFaceId(supportedTypes)) {
    return {
      biometricName,
      message: getExpoGoFaceIdMessage(),
      success: false,
    };
  }

  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  if (!isEnrolled) {
    return {
      biometricName,
      message: isIphone() ? getFaceIdSetupMessage() : `Налаштуйте ${biometricName} у системі.`,
      success: false,
    };
  }

  const result = await LocalAuthentication.authenticateAsync({
    biometricsSecurityLevel: 'strong',
    cancelLabel: 'Скасувати',
    disableDeviceFallback: true,
    fallbackLabel: '',
    promptDescription: `QuestMe використовує ${biometricName} лише для підтвердження входу.`,
    promptMessage: options.promptMessage ?? `Підтвердьте вхід через ${biometricName}`,
    promptSubtitle: 'Безпечний вхід у QuestMe',
  });

  return {
    biometricName,
    message: result.success
      ? `${biometricName} підтверджено.`
      : `${biometricName} не підтверджено. Спробуйте ще раз.`,
    success: result.success,
  };
}
