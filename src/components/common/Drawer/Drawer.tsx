import { useEffect } from 'react';
import { HeaderNavLink } from '../Header/components/HeaderNavLink/HeaderNavLink';
import { useI18n } from '../../../i18n/I18nContext';
import './Drawer.css';
import { LOCALE_INFO, type Locale } from '../../../i18n/types';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Drawer = ({ isOpen, onClose }: DrawerProps) => {
  const { t, locale, setLocale } = useI18n();
  const localeOptions = Object.entries(LOCALE_INFO).map(([locale, info]) => ({
    value: locale,
    label: info.name,
  }));

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const drawerClasses = `drawer ${isOpen ? 'open' : ''}`.trim();

  return (
    <div className={drawerClasses}>
      <span className="drawer-title">{t('navigation.drawer.title')}</span>
      <div className="language-buttons">
        {localeOptions.map((option) => {
          return (
            <button
              key={option.value}
              className={`mobile-locale-button ${locale === option.value ? 'active' : ''}`.trim()}
              onClick={() => setLocale(option.value as Locale)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      <nav className="mobile-navs">
        <HeaderNavLink to="/">{t('navigation.home')}</HeaderNavLink>
        <HeaderNavLink to="/applications">
          {t('navigation.applications')}
        </HeaderNavLink>
      </nav>
    </div>
  );
};
