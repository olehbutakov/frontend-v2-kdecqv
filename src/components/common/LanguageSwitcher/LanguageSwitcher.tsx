import { useI18n } from '../../../i18n/I18nContext';
import { LOCALE_INFO, type Locale } from '../../../i18n/types';
import { CustomSelect } from '../CustomSelect/CustomSelect';
import './LanguageSwitcher.css';

export const LanguageSwitcher = () => {
  const { locale, setLocale } = useI18n();
  const localeOptions = Object.entries(LOCALE_INFO).map(([locale, info]) => ({
    value: locale,
    label: info.name,
  }));

  const handleChange = (value: string) => {
    setLocale(value as Locale);
  };

  return (
    <div className="language-switcher">
      <CustomSelect
        options={localeOptions}
        value={locale}
        onChange={handleChange}
      />
    </div>
  );
};
