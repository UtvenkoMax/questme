import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

type SecureStoreOptions = Parameters<typeof SecureStore.setItemAsync>[2];

const WEB_ENCRYPTED_PREFIX = 'web-aes-gcm:v1';
const WEB_CRYPTO_KEY = 'questme.web.crypto.key';
const SENSITIVE_STORAGE_KEYS = new Set([
  'questme.auth.session',
  'questme.profile',
  'questme.quests',
  'questme.map.nearbyCache',
  'questme.registration.pending',
  'questme.recovery.code',
]);

function logJsonParseError(key: string, error: unknown) {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;

  if (env?.NODE_ENV !== 'production') {
    console.warn(`[QuestMe storage] Failed to parse JSON for "${key}".`, error);
  }
}

function logStorageError(key: string, error: unknown) {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;

  if (env?.NODE_ENV !== 'production') {
    console.warn(`[QuestMe storage] Web storage is unavailable for "${key}".`, error);
  }
}

function canUseWebStorage() {
  return Platform.OS === 'web' && typeof window !== 'undefined';
}

function getWebStorage(key: string) {
  if (!canUseWebStorage()) return null;

  try {
    if (key === 'questme.auth.session' && window.sessionStorage) {
      return window.sessionStorage;
    }

    return window.localStorage;
  } catch (error) {
    logStorageError(key, error);
    return null;
  }
}

function getWebCrypto() {
  return canUseWebStorage() ? window.crypto : undefined;
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function base64ToBytes(value: string) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function canEncryptWebValue(key: string) {
  const crypto = getWebCrypto();
  return Boolean(
    Platform.OS === 'web' &&
      SENSITIVE_STORAGE_KEYS.has(key) &&
      crypto?.subtle &&
      typeof crypto.getRandomValues === 'function' &&
      typeof TextEncoder !== 'undefined' &&
      typeof TextDecoder !== 'undefined'
  );
}

async function getWebEncryptionKey() {
  const crypto = getWebCrypto();
  if (!crypto?.subtle) throw new Error('Web Crypto API is unavailable.');

  const rawKey = window.localStorage.getItem(WEB_CRYPTO_KEY);
  if (rawKey) {
    return crypto.subtle.importKey('raw', base64ToBytes(rawKey), 'AES-GCM', false, ['encrypt', 'decrypt']);
  }

  const key = await crypto.subtle.generateKey({ length: 256, name: 'AES-GCM' }, true, ['encrypt', 'decrypt']);
  const exportedKey = await crypto.subtle.exportKey('raw', key);
  window.localStorage.setItem(WEB_CRYPTO_KEY, bytesToBase64(new Uint8Array(exportedKey)));
  return key;
}

async function encryptWebValue(key: string, value: string) {
  if (!canEncryptWebValue(key)) return value;

  try {
    const crypto = getWebCrypto();
    if (!crypto?.subtle) return value;

    const iv = new Uint8Array(12);
    crypto.getRandomValues(iv);

    const encrypted = await crypto.subtle.encrypt(
      { iv, name: 'AES-GCM' },
      await getWebEncryptionKey(),
      new TextEncoder().encode(value)
    );

    return `${WEB_ENCRYPTED_PREFIX}:${bytesToBase64(iv)}:${bytesToBase64(new Uint8Array(encrypted))}`;
  } catch (error) {
    logStorageError(key, error);
    return value;
  }
}

async function decryptWebValue(key: string, value: string) {
  if (!value.startsWith(`${WEB_ENCRYPTED_PREFIX}:`) || !canEncryptWebValue(key)) return value;

  try {
    const [, , ivBase64, encryptedBase64] = value.split(':');
    if (!ivBase64 || !encryptedBase64) return value;

    const crypto = getWebCrypto();
    if (!crypto?.subtle) return value;

    const decrypted = await crypto.subtle.decrypt(
      { iv: base64ToBytes(ivBase64), name: 'AES-GCM' },
      await getWebEncryptionKey(),
      base64ToBytes(encryptedBase64)
    );

    return new TextDecoder().decode(decrypted);
  } catch (error) {
    logStorageError(key, error);
    return value;
  }
}

export async function getStorageItem(key: string) {
  const storage = getWebStorage(key);
  if (storage) {
    const value = storage.getItem(key);
    return value ? decryptWebValue(key, value) : null;
  }

  return SecureStore.getItemAsync(key);
}

export async function setStorageItem(key: string, value: string, options?: SecureStoreOptions) {
  const storage = getWebStorage(key);
  if (storage) {
    storage.setItem(key, await encryptWebValue(key, value));
    return;
  }

  await SecureStore.setItemAsync(key, value, options);
}

export async function deleteStorageItem(key: string) {
  const storage = getWebStorage(key);
  if (storage) {
    storage.removeItem(key);
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
