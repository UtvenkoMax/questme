import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

type SecureStoreOptions = Parameters<typeof SecureStore.setItemAsync>[2];

function logJsonParseError(key: string, error: unknown) {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;

  if (env?.NODE_ENV !== 'production') {
    console.warn(`[QuestMe storage] Failed to parse JSON for "${key}".`, error);
  }
}

function canUseWebStorage() {
  return Platform.OS === 'web' && typeof window !== 'undefined' && Boolean(window.localStorage);
}

export async function getStorageItem(key: string) {
  if (canUseWebStorage()) {
    return window.localStorage.getItem(key);
  }

  return SecureStore.getItemAsync(key);
}

export async function setStorageItem(key: string, value: string, options?: SecureStoreOptions) {
  if (canUseWebStorage()) {
    window.localStorage.setItem(key, value);
    return;
  }

  await SecureStore.setItemAsync(key, value, options);
}

export async function deleteStorageItem(key: string) {
  if (canUseWebStorage()) {
    window.localStorage.removeItem(key);
    return;
  }

  await SecureStore.deleteItemAsync(key);
}

export async function getJsonItem<T>(key: string) {
  const rawValue = await getStorageItem(key);
  if (!rawValue) return null;

  try {
    return JSON.parse(rawValue) as T;
  } catch (error) {
    logJsonParseError(key, error);
    return null;
  }
}

export async function setJsonItem<T>(key: string, value: T, options?: SecureStoreOptions) {
  await setStorageItem(key, JSON.stringify(value), options);
}

export async function deleteStorageItems(keys: string[]) {
  await Promise.all(keys.map((key) => deleteStorageItem(key)));
}
