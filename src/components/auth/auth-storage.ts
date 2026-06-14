import * as SecureStore from 'expo-secure-store';

export const REGISTRATION_KEY = 'questme.registration';
export const SESSION_KEY = 'questme.session';

export const SECURE_STORE_OPTIONS: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

export type RegistrationRecord = {
  createdAt: string;
  email: string;
  name: string;
  password?: string;
};

export type SessionRecord = {
  email: string;
  loggedInAt: string;
  name: string;
};

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export async function getAuthItem(key: string) {
  if (await canUseSecureStore()) {
    return SecureStore.getItemAsync(key);
  }

  return getWebStorage()?.getItem(key) ?? null;
}

export async function setAuthItem(key: string, value: string) {
  if (await canUseSecureStore()) {
    await SecureStore.setItemAsync(key, value, SECURE_STORE_OPTIONS);
    return;
  }

  getWebStorage()?.setItem(key, value);
}

export async function deleteAuthItem(key: string) {
  if (await canUseSecureStore()) {
    await SecureStore.deleteItemAsync(key);
    return;
  }

  getWebStorage()?.removeItem(key);
}

export function parseRegistrationRecord(value: string | null): RegistrationRecord | null {
  if (!value) return null;

  try {
    const record = JSON.parse(value) as Partial<RegistrationRecord>;

    if (typeof record.email !== 'string' || typeof record.name !== 'string') {
      return null;
    }

    return {
      createdAt: typeof record.createdAt === 'string' ? record.createdAt : '',
      email: normalizeEmail(record.email),
      name: record.name.trim(),
      password: typeof record.password === 'string' ? record.password : undefined,
    };
  } catch {
    return null;
  }
}

async function canUseSecureStore() {
  try {
    return await SecureStore.isAvailableAsync();
  } catch {
    return false;
  }
}

function getWebStorage() {
  if (typeof localStorage === 'undefined') {
    return null;
  }

  return localStorage;
}

export function parseSessionRecord(value: string | null): SessionRecord | null {
  if (!value) return null;

  try {
    const record = JSON.parse(value) as Partial<SessionRecord>;

    if (
      typeof record.email !== 'string' ||
      typeof record.loggedInAt !== 'string' ||
      typeof record.name !== 'string'
    ) {
      return null;
    }

    return {
      email: normalizeEmail(record.email),
      loggedInAt: record.loggedInAt,
      name: record.name.trim(),
    };
  } catch {
    return null;
  }
}
