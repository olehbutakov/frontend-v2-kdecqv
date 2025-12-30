import enUS from './translations/en-US.json';
import frCA from './translations/fr-CA.json';

// All supported translations
export const translations = {
  'en-US': enUS,
  'fr-CA': frCA,
} as const;

// Supported locales
export type Locale = keyof typeof translations;

// Default locale translation keys (in this case English US as an example)
export type TranslationKey = keyof typeof enUS;

// Locale metadata
export interface LocaleInfo {
  name: string;
  flag: string;
}

export const LOCALE_INFO: Record<Locale, LocaleInfo> = {
  'en-US': { name: 'English (US)', flag: '🇺🇸' },
  'fr-CA': { name: 'Français (Canada)', flag: '🇨🇦' },
};
