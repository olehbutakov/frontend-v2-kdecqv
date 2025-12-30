import { useI18n } from '../../../i18n/I18nContext';
import { LOCALE_INFO, type Locale } from '../../../i18n/types';

export const LanguageSwitcher = () => {
  const { locale, setLocale } = useI18n();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLocale(event.target.value as Locale);
  };

  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      <select
        value={locale}
        onChange={handleChange}
        style={{
          padding: '8px 12px',
          fontSize: '14px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          backgroundColor: '#fff',
          cursor: 'pointer',
          color: '#000',
        }}
      >
        {Object.entries(LOCALE_INFO).map(([code, info]) => (
          <option key={code} value={code}>
            {info.flag} {info.name}
          </option>
        ))}
      </select>
    </div>
  );
};
