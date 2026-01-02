import { Link } from 'react-router-dom';
import { LanguageSwitcher } from '../LanguageSwitcher/LanguageSwitcher';
import './Header.css';
import { HeaderNavLink } from './components/HeaderNavLink/HeaderNavLink';

export const Header = () => {
  return (
    <header>
      <Link to="/">
        <img
          src="/assets/nesto-EN_Primary.png"
          alt="Nesto logo"
          className="header-logo"
        />
      </Link>
      <nav>
        <LanguageSwitcher />
        <HeaderNavLink to="/">Home</HeaderNavLink>
        <HeaderNavLink to="/applications">Applications</HeaderNavLink>
      </nav>
    </header>
  );
};
