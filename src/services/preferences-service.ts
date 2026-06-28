import { getLocales } from 'expo-localization';

import { getJsonItem, setJsonItem } from './app-storage';

const PREFERENCES_KEY = 'questme.preferences';

export type ThemePreference = 'system' | 'light' | 'dark';
export type LanguagePreference = 'system' | 'uk' | 'en';
export type InterestId = 'city' | 'history' | 'nature' | 'fitness' | 'food' | 'photo';

export type AppPreferences = {
  interests: InterestId[];
  language: LanguagePreference;
  theme: ThemePreference;
};

export const INTEREST_OPTIONS: { id: InterestId; label: string }[] = [
  { id: 'city', label: 'Місто' },
  { id: 'history', label: 'Історія' },
  { id: 'nature', label: 'Природа' },
  { id: 'fitness', label: 'Фітнес' },
  { id: 'food', label: 'Їжа' },
  { id: 'photo', label: 'Фото' },
];

export const DEFAULT_PREFERENCES: AppPreferences = {
  interests: ['city', 'history'],
  language: 'system',
  theme: 'system',
};

function normalizeLanguage(language: string | null | undefined): 'uk' | 'en' {
  return language === 'en' ? 'en' : 'uk';
}

export function resolveLanguagePreference(language: LanguagePreference) {
  if (language !== 'system') return language;
  return normalizeLanguage(getLocales()[0]?.languageCode);
}

export async function getAppPreferences() {
  const storedPreferences = await getJsonItem<Partial<AppPreferences>>(PREFERENCES_KEY);

  return {
    ...DEFAULT_PREFERENCES,
    ...storedPreferences,
    interests: storedPreferences?.interests?.length ? storedPreferences.interests : DEFAULT_PREFERENCES.interests,
  } satisfies AppPreferences;
}

export async function saveAppPreferences(preferences: AppPreferences) {
  await setJsonItem(PREFERENCES_KEY, preferences);
}
