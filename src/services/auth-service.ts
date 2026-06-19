import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import {
  deleteStorageItem,
  deleteStorageItems,
  getJsonItem,
  getStorageItem,
  setJsonItem,
  setStorageItem,
} from './app-storage';

export const STORAGE_KEYS = {
  authSession: 'questme.auth.session',
  biometricEnabled: 'questme.biometric.enabled',
  faceIdEnabled: 'questme.faceId.enabled',
  onboardingSeen: 'questme.onboarding.seen',
  pendingRegistration: 'questme.registration.pending',
  pin: 'questme.pin',
  pinAttempts: 'questme.pin.attempts',
  pinLockedUntil: 'questme.pin.lockedUntil',
  profile: 'questme.profile',
  quests: 'questme.quests',
} as const;

export type AuthProvider = 'backend' | 'local';

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  authProvider: AuthProvider;
};

export type AuthSession = {
  token?: string;
  signedInAt: string;
};

export type RegistrationInput = {
  name: string;
  email: string;
  password: string;
};

export type RegistrationErrors = Partial<Record<keyof RegistrationInput, string>>;
export type ProfileErrors = Partial<Record<'email' | 'name', string>>;

export type PasswordStrength = {
  label: string;
  score: 0 | 1 | 2 | 3;
};

type BackendRegisterResponse = {
  token?: string;
  user?: Partial<UserProfile>;
  profile?: Partial<UserProfile>;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const LEGACY_PROFILE_KEY = 'questme.registration';
const WEB_PIN_HASH_PREFIX = 'web-sha256';
const MAX_PIN_ATTEMPTS = 5;
const PIN_LOCK_DURATION_MS = 5 * 60 * 1000;

type BackendResponseBody = BackendRegisterResponse & {
  error?: unknown;
  message?: unknown;
};

type WebCryptoLike = {
  getRandomValues?: (array: Uint8Array) => Uint8Array;
  subtle?: {
    digest: (algorithm: string, data: BufferSource) => Promise<ArrayBuffer>;
  };
};

function getAuthApiUrl() {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;
  return env?.EXPO_PUBLIC_AUTH_API_URL?.replace(/\/+$/, '') ?? '';
}

function createLocalId() {
  return `local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function getWebCrypto() {
  return (globalThis as { crypto?: WebCryptoLike }).crypto;
}

function canHashPinOnWeb() {
  const crypto = getWebCrypto();
  return Platform.OS === 'web' && Boolean(crypto?.subtle && crypto.getRandomValues);
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

async function sha256Base64(value: string) {
  const crypto = getWebCrypto();
  if (!crypto?.subtle) throw new Error('Web Crypto API недоступний.');

  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return bytesToBase64(new Uint8Array(digest));
}

function createPinSalt() {
  const crypto = getWebCrypto();
  if (!crypto?.getRandomValues) throw new Error('Web Crypto API недоступний.');

  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);
  return bytesToBase64(salt);
}

async function encodePinForStorage(pin: string) {
  if (!canHashPinOnWeb()) return pin;

  const salt = createPinSalt();
  const hash = await sha256Base64(`${salt}:${pin}`);
  return `${WEB_PIN_HASH_PREFIX}:${salt}:${hash}`;
}

async function doesPinMatch(pin: string, savedPin: string) {
  if (!savedPin.startsWith(`${WEB_PIN_HASH_PREFIX}:`)) {
    return savedPin === pin;
  }

  const [, salt, savedHash] = savedPin.split(':');
  if (!salt || !savedHash) return false;

  return (await sha256Base64(`${salt}:${pin}`)) === savedHash;
}

async function clearPinAttemptState() {
  await deleteStorageItems([STORAGE_KEYS.pinAttempts, STORAGE_KEYS.pinLockedUntil]);
}

async function getActivePinLockTimestamp() {
  const rawValue = await getStorageItem(STORAGE_KEYS.pinLockedUntil);
  const timestamp = rawValue ? Number(rawValue) : 0;

  if (!Number.isFinite(timestamp) || timestamp <= Date.now()) {
    if (rawValue) await deleteStorageItem(STORAGE_KEYS.pinLockedUntil);
    return 0;
  }

  return timestamp;
}

async function recordFailedPinAttempt() {
  const rawValue = await getStorageItem(STORAGE_KEYS.pinAttempts);
  const currentAttempts = rawValue ? Number(rawValue) : 0;
  const nextAttempts = Number.isFinite(currentAttempts) ? currentAttempts + 1 : 1;

  if (nextAttempts >= MAX_PIN_ATTEMPTS) {
    await Promise.all([
      setStorageItem(STORAGE_KEYS.pinLockedUntil, String(Date.now() + PIN_LOCK_DURATION_MS)),
      setStorageItem(STORAGE_KEYS.pinAttempts, '0'),
    ]);
    return;
  }

  await setStorageItem(STORAGE_KEYS.pinAttempts, String(nextAttempts));
}

function parseBackendJson(text: string) {
  if (!text.trim()) return {};

  try {
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === 'object' ? (parsed as BackendResponseBody) : {};
  } catch {
    return null;
  }
}

function getBackendErrorMessage(data: BackendResponseBody, status: number) {
  if (typeof data.message === 'string' && data.message.trim()) return data.message;
  if (typeof data.error === 'string' && data.error.trim()) return data.error;
  return `Не вдалося виконати запит до сервера. HTTP ${status}.`;
}

async function postToAuthApi(path: string, payload: unknown) {
  const baseUrl = getAuthApiUrl();
  if (!baseUrl) return null;

  const response = await fetch(`${baseUrl}${path}`, {
    body: JSON.stringify(payload),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  const text = await response.text();
  const data = parseBackendJson(text);

  if (!data) {
    if (!response.ok) {
      throw new Error(`Сервер авторизації повернув не-JSON помилку. HTTP ${response.status}.`);
    }

    throw new Error('Сервер авторизації повернув відповідь не у JSON форматі.');
  }

  if (!response.ok) {
    throw new Error(getBackendErrorMessage(data, response.status));
  }

  return data as BackendRegisterResponse;
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function getPasswordStrength(password: string): PasswordStrength {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-ZА-ЯІЇЄ]/.test(password) && /[a-zа-яіїє]/.test(password)) score += 1;
  if (/\d/.test(password) || /[^A-Za-zА-Яа-яІіЇїЄє0-9]/.test(password)) score += 1;

  if (score >= 3) return { label: 'Сильний пароль', score: 3 };
  if (score === 2) return { label: 'Нормальний пароль', score: 2 };
  if (score === 1) return { label: 'Слабкий пароль', score: 1 };
  return { label: 'Додайте мінімум 8 символів', score: 0 };
}

export function validateRegistration(input: RegistrationInput) {
  const errors: RegistrationErrors = {};
  const name = input.name.trim();
  const email = normalizeEmail(input.email);

  if (name.length < 2) {
    errors.name = 'Вкажіть імʼя мінімум з 2 символів.';
  }

  if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Вкажіть коректний email.';
  }

  if (input.password.length < 8) {
    errors.password = 'Пароль має містити мінімум 8 символів.';
  } else if (getPasswordStrength(input.password).score < 2) {
    errors.password = 'Додайте великі/малі літери, цифру або символ.';
  }

  return errors;
}

export function hasRegistrationErrors(errors: RegistrationErrors) {
  return Boolean(errors.name || errors.email || errors.password);
}

export function validateProfile(input: Pick<UserProfile, 'email' | 'name'>) {
  const errors: ProfileErrors = {};
  const name = input.name.trim();
  const email = normalizeEmail(input.email);

  if (name.length < 2) {
    errors.name = 'Вкажіть імʼя мінімум з 2 символів.';
  }

  if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Вкажіть коректний email.';
  }

  return errors;
}

export function hasProfileErrors(errors: ProfileErrors) {
  return Boolean(errors.name || errors.email);
}

export async function registerAccount(input: RegistrationInput) {
  const email = normalizeEmail(input.email);
  const backendResponse = await postToAuthApi('/register', {
    email,
    name: input.name.trim(),
    password: input.password,
  });
  const profileSource = backendResponse?.user ?? backendResponse?.profile;
  const profile: UserProfile = {
    authProvider: backendResponse ? 'backend' : 'local',
    createdAt: profileSource?.createdAt ?? new Date().toISOString(),
    email: profileSource?.email ?? email,
    id: profileSource?.id ?? createLocalId(),
    name: profileSource?.name ?? input.name.trim(),
  };

  await Promise.all([
    setJsonItem(STORAGE_KEYS.profile, profile),
    setJsonItem(STORAGE_KEYS.authSession, {
      signedInAt: new Date().toISOString(),
      token: backendResponse?.token,
    } satisfies AuthSession),
  ]);

  return profile;
}

export async function getAuthSession() {
  return getJsonItem<AuthSession>(STORAGE_KEYS.authSession);
}

export async function startAuthSession(token?: string) {
  const currentSession = await getAuthSession();

  await setJsonItem(STORAGE_KEYS.authSession, {
    signedInAt: new Date().toISOString(),
    token: token ?? currentSession?.token,
  } satisfies AuthSession);
}

export async function getUserProfile() {
  const profile = await getJsonItem<UserProfile>(STORAGE_KEYS.profile);
  if (profile) return profile;

  const legacyProfile = await getJsonItem<UserProfile>(LEGACY_PROFILE_KEY);
  if (!legacyProfile) return null;

  await setJsonItem(STORAGE_KEYS.profile, legacyProfile);
  return legacyProfile;
}

export async function updateUserProfile(profile: Pick<UserProfile, 'email' | 'name'>) {
  const currentProfile = await getUserProfile();
  if (!currentProfile) throw new Error('Профіль не знайдено.');

  const nextProfile: UserProfile = {
    ...currentProfile,
    email: normalizeEmail(profile.email),
    name: profile.name.trim(),
  };

  await setJsonItem(STORAGE_KEYS.profile, nextProfile);
  return nextProfile;
}

export async function savePendingRegistration(input: RegistrationInput) {
  await setJsonItem(STORAGE_KEYS.pendingRegistration, {
    email: normalizeEmail(input.email),
    name: input.name.trim(),
    password: input.password,
  });
}

export async function getPendingRegistration() {
  return getJsonItem<RegistrationInput>(STORAGE_KEYS.pendingRegistration);
}

export async function clearPendingRegistration() {
  await deleteStorageItems([STORAGE_KEYS.pendingRegistration]);
}

export async function savePin(pin: string) {
  const value = await encodePinForStorage(pin);

  await setStorageItem(STORAGE_KEYS.pin, value, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
  await clearPinAttemptState();
}

export async function getSavedPin() {
  return getStorageItem(STORAGE_KEYS.pin);
}

export async function verifyPin(pin: string) {
  const lockTimestamp = await getActivePinLockTimestamp();
  if (lockTimestamp) return false;

  const savedPin = await getSavedPin();
  const isValid = Boolean(savedPin && (await doesPinMatch(pin, savedPin)));

  if (isValid) {
    await clearPinAttemptState();
    return true;
  }

  await recordFailedPinAttempt();
  return false;
}

export async function getPinLockedUntil() {
  const lockTimestamp = await getActivePinLockTimestamp();
  return lockTimestamp ? new Date(lockTimestamp) : null;
}

export async function hasPin() {
  return Boolean(await getSavedPin());
}

export async function setBiometricEnabled(enabled: boolean) {
  await Promise.all([
    setStorageItem(STORAGE_KEYS.biometricEnabled, enabled ? 'true' : 'false'),
    setStorageItem(STORAGE_KEYS.faceIdEnabled, enabled ? 'true' : 'false'),
  ]);
}

export async function isBiometricEnabled() {
  return (await getStorageItem(STORAGE_KEYS.biometricEnabled)) === 'true';
}

export async function setOnboardingSeen() {
  await setStorageItem(STORAGE_KEYS.onboardingSeen, 'true');
}

export async function isOnboardingSeen() {
  return (await getStorageItem(STORAGE_KEYS.onboardingSeen)) === 'true';
}

export async function logout() {
  await deleteStorageItems([STORAGE_KEYS.authSession]);
}

export async function deleteLocalAccountData() {
  await deleteStorageItems([...Object.values(STORAGE_KEYS), LEGACY_PROFILE_KEY]);
}
