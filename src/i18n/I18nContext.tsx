/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useCallback,
} from 'react';
import { translations, type Locale, type TranslationKey } from './types';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  formatCurrency: (amount: number, currency?: string) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
  defaultLocale?: Locale;
}

export const I18nProvider = ({
  children,
  defaultLocale = 'en-US',
}: I18nProviderProps) => {
  const [locale, setLocale] = useState<Locale>(defaultLocale);

  const t = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>): string => {
      const currentTranslations = translations[locale] as Record<
        string,
        string
      >;

      // NOTE: Usually such things are handled by frameworks like react-i18next or react-intls
      // Handle plural
      let translationKey = key;
      if (params?.count !== undefined) {
        const count = Number(params.count);
        const pluralSufix = count === 1 ? 'one' : 'other';
        translationKey = `${key}_${pluralSufix}` as TranslationKey;
      }

      // Try current locale with plural key
      if (currentTranslations[translationKey]) {
        return interpolate(currentTranslations[translationKey], params);
      }

      // Try current locale with base key
      if (currentTranslations[translationKey]) {
        return interpolate(currentTranslations[key], params);
      }

      // Missing in current locale - return key instead, e.g. form.firstName.label
      return key;
    },
    [locale]
  );

  const formatCurrency = useCallback(
    (amount: number, currency?: string): string => {
      const defaultCurrency = locale === 'fr-CA' ? 'CAD' : 'USD';
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency || defaultCurrency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    },
    [locale]
  );

  const formatNumber = useCallback(
    (value: number, options?: Intl.NumberFormatOptions): string => {
      return new Intl.NumberFormat(locale, options).format(value);
    },
    [locale]
  );

  const value = {
    locale,
    setLocale,
    t,
    formatCurrency,
    formatNumber,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
};

// Helper function for parameter interpolation
function interpolate(
  translation: string,
  params?: Record<string, string | number>
): string {
  if (!params) return translation;

  let result = translation;
  Object.entries(params).forEach(([paramKey, value]) => {
    const regex = new RegExp(`{{${paramKey}}}`, 'g');
    result = result.replace(regex, String(value));
  });
  return result;
}
