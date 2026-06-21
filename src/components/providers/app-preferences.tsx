import * as SystemUI from 'expo-system-ui';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import i18n from '@/locales/i18n';
import {
  DEFAULT_PREFERENCES,
  getAppPreferences,
  resolveLanguagePreference,
  saveAppPreferences,
  type AppPreferences,
} from '@/services/preferences-service';
import { colors } from '@/theme';

type ThemePalette = {
  [Key in keyof typeof colors]: string;
};

type ResolvedTheme = {
  colors: ThemePalette;
  isDark: boolean;
};

type AppPreferencesContextValue = {
  isReady: boolean;
  preferences: AppPreferences;
  setPreferences: (preferences: AppPreferences) => Promise<void>;
  theme: ResolvedTheme;
  updatePreferences: (nextPreferences: Partial<AppPreferences>) => Promise<void>;
};

const lightColors: ThemePalette = colors;

const darkColors: ThemePalette = {
  ...colors,
  background: '#0B0D12',
  backgroundAlt: '#11151D',
  border: '#2A3140',
  borderSoft: '#202635',
  borderStrong: '#3A4354',
  canvas: '#10141D',
  canvasParchment: '#0E1219',
  ink: '#F7F8FA',
  inkMuted: '#CFD5E1',
  inkSubtle: '#8E99AA',
  primarySoft: '#102A44',
  surface: colors.surface,
  surfaceMuted: colors.surfaceMuted,
  surfacePearl: colors.surfacePearl,
};

const defaultContextValue: AppPreferencesContextValue = {
  isReady: false,
  preferences: DEFAULT_PREFERENCES,
  setPreferences: async () => {},
  theme: { colors: lightColors, isDark: false },
  updatePreferences: async () => {},
};

const AppPreferencesContext = createContext<AppPreferencesContextValue>(defaultContextValue);

export function AppPreferencesProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [preferences, setPreferencesState] = useState<AppPreferences>(DEFAULT_PREFERENCES);
  const [isReady, setIsReady] = useState(false);
  const isDark =
    preferences.theme === 'dark' || (preferences.theme === 'system' && systemColorScheme === 'dark');
  const theme = useMemo<ResolvedTheme>(
    () => ({
      colors: isDark ? darkColors : lightColors,
      isDark,
    }),
    [isDark]
  );

  const setPreferences = useCallback(async (nextPreferences: AppPreferences) => {
    setPreferencesState(nextPreferences);
    await saveAppPreferences(nextPreferences);
  }, []);

  const updatePreferences = useCallback(async (nextPreferences: Partial<AppPreferences>) => {
    await setPreferences({
      ...preferences,
      ...nextPreferences,
    });
  }, [preferences, setPreferences]);

  useEffect(() => {
    let isMounted = true;

    async function loadPreferences() {
      const storedPreferences = await getAppPreferences();
      if (!isMounted) return;

      setPreferencesState(storedPreferences);
      setIsReady(true);
    }

    loadPreferences();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    i18n.changeLanguage(resolveLanguagePreference(preferences.language));
  }, [preferences.language]);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(theme.colors.background).catch(() => {});
  }, [theme.colors.background]);

  const value = useMemo<AppPreferencesContextValue>(
    () => ({
      isReady,
      preferences,
      setPreferences,
      theme,
      updatePreferences,
    }),
    [isReady, preferences, setPreferences, theme, updatePreferences]
  );

  return <AppPreferencesContext.Provider value={value}>{children}</AppPreferencesContext.Provider>;
}

export function useAppPreferences() {
  return useContext(AppPreferencesContext);
}

export function useAppTheme() {
  return useAppPreferences().theme;
}
