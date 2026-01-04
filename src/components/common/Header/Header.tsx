import { Link } from 'react-router-dom';
import { LanguageSwitcher } from '../LanguageSwitcher/LanguageSwitcher';
import './Header.css';
import { HeaderNavLink } from './components/HeaderNavLink/HeaderNavLink';
import { useI18n } from '../../../i18n/I18nContext';

export const Header = () => {
  const { t } = useI18n();

  return (
    <header>
      <Link to="/">
        <img
          src="/assets/nesto-EN_Primary.png"
          alt={t('navigation.logo.alt.text')}
          className="header-logo"
        />
      </Link>
      <nav>
        <LanguageSwitcher />
        <HeaderNavLink to="/">{t('navigation.home')}</HeaderNavLink>
        <HeaderNavLink to="/applications">
          {t('navigation.applications')}
        </HeaderNavLink>
      </nav>
    </header>
  );
};
