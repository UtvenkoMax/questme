import * as SecureStore from 'expo-secure-store';

import { deleteStorageItems, getJsonItem, getStorageItem, setJsonItem, setStorageItem } from './app-storage';

export const STORAGE_KEYS = {
  authSession: 'questme.auth.session',
  biometricEnabled: 'questme.biometric.enabled',
  faceIdEnabled: 'questme.faceId.enabled',
  onboardingSeen: 'questme.onboarding.seen',
  pendingRegistration: 'questme.registration.pending',
  pin: 'questme.pin',
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

type BackendResponseBody = BackendRegisterResponse & {
  error?: unknown;
  message?: unknown;
};

function getAuthApiUrl() {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;
  return env?.EXPO_PUBLIC_AUTH_API_URL?.replace(/\/+$/, '') ?? '';
}

function createLocalId() {
  return `local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
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
  await setStorageItem(STORAGE_KEYS.pin, pin, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
}

export async function getSavedPin() {
  return getStorageItem(STORAGE_KEYS.pin);
}

export async function verifyPin(pin: string) {
  const savedPin = await getSavedPin();
  return Boolean(savedPin && savedPin === pin);
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
