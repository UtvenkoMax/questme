import Constants from 'expo-constants';
import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';

export const BIOMETRIC_ENABLED_KEY = 'questme.biometric.enabled';
export const FACE_ID_ENABLED_KEY = 'questme.faceId.enabled';
export const PIN_KEY = 'questme.pin';

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
