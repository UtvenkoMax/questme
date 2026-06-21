import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';

import en from './en.json';
import uk from './uk.json';

const resources = {
  en: { translation: en },
  uk: { translation: uk },
};

const i18n = createInstance();

i18n.use(initReactI18next).init({
  resources,
  lng: getLocales()[0].languageCode ?? 'uk',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
