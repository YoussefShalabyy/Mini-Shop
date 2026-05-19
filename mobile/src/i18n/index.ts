import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import { I18nManager } from 'react-native';

import en from './locales/en.json';
import ar from './locales/ar.json';

export type SupportedLocale = 'en' | 'ar';

export const SUPPORTED_LOCALES: { code: SupportedLocale; label: string; nativeLabel: string }[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'ar', label: 'Arabic',  nativeLabel: 'العربية' },
];

// Detect device language, fallback to 'en'
const deviceLocale = getLocales()[0]?.languageCode ?? 'en';
const defaultLocale: SupportedLocale = deviceLocale === 'ar' ? 'ar' : 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    lng: defaultLocale,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

/**
 * Call this when the user switches language.
 * Handles RTL layout direction automatically.
 */
export function changeLanguage(locale: SupportedLocale) {
  i18n.changeLanguage(locale);
  const isRTL = locale === 'ar';
  if (I18nManager.isRTL !== isRTL) {
    I18nManager.forceRTL(isRTL);
  }
}

export default i18n;
