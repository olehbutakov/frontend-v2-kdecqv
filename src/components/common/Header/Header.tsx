import { Link } from 'react-router-dom';
import { LanguageSwitcher } from '../LanguageSwitcher/LanguageSwitcher';
import './Header.css';
import { HeaderNavLink } from './components/HeaderNavLink/HeaderNavLink';
import { useI18n } from '../../../i18n/I18nContext';
import { HamburgerButton } from './components/HamburgerButton/HamburgerButton';
import { useEffect, useState } from 'react';
import { Overlay } from '../Overlay/Overlay';
import { Drawer } from '../Drawer/Drawer';

export const Header = () => {
  const { t } = useI18n();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? 'hidden' : '';
  }, [isDrawerOpen]);

  return (
    <>
      <header>
        <Link to="/">
          <img
            src="/assets/nesto-EN_Primary.png"
            alt={t('navigation.logo.alt.text')}
            className="header-logo"
          />
        </Link>
        <nav className="desktop-navs">
          <LanguageSwitcher />
          <HeaderNavLink to="/">{t('navigation.home')}</HeaderNavLink>
          <HeaderNavLink to="/applications">
            {t('navigation.applications')}
          </HeaderNavLink>
        </nav>
        <HamburgerButton
          className="mobile-hamburger"
          onClick={() => setIsDrawerOpen(true)}
        />
      </header>

      <Overlay isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
};
