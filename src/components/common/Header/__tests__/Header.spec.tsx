import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Header } from '../Header';

jest.mock('../../../../i18n/I18nContext', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('react-router-dom', () => ({
  Link: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}));

jest.mock('../../LanguageSwitcher/LanguageSwitcher', () => ({
  LanguageSwitcher: () => <div>LanguageSwitcher</div>,
}));

jest.mock('../components/HeaderNavLink/HeaderNavLink', () => ({
  HeaderNavLink: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}));

jest.mock('../components/HamburgerButton/HamburgerButton', () => ({
  HamburgerButton: ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick}>Hamburger</button>
  ),
}));

jest.mock('../../Overlay/Overlay', () => ({
  Overlay: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
    <div>{isOpen && <button onClick={onClose}>OverlayClose</button>}</div>
  ),
}));

jest.mock('../../Drawer/Drawer', () => ({
  Drawer: ({ isOpen }: { isOpen: boolean }) => (
    <div>{isOpen ? 'Drawer Open' : 'Drawer Closed'}</div>
  ),
}));

describe('Header', () => {
  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('renders logo with translated alt text', () => {
    render(<Header />);

    const logo = screen.getByAltText('navigation.logo.alt.text');

    expect(logo).toBeInTheDocument();
  });

  it('renders desktop navigation items', () => {
    render(<Header />);

    expect(screen.getByText('LanguageSwitcher')).toBeInTheDocument();

    expect(screen.getByText('navigation.home')).toBeInTheDocument();

    expect(screen.getByText('navigation.applications')).toBeInTheDocument();
  });

  it('drawer is closed by default', () => {
    render(<Header />);

    expect(screen.getByText('Drawer Closed')).toBeInTheDocument();

    expect(document.body.style.overflow).toBe('');
  });

  it('opens drawer and locks body scroll when hamburger is clicked', () => {
    render(<Header />);

    fireEvent.click(screen.getByText('Hamburger'));

    expect(screen.getByText('Drawer Open')).toBeInTheDocument();

    expect(document.body.style.overflow).toBe('hidden');
  });

  it('closes drawer and restores body scroll when overlay is clicked', () => {
    render(<Header />);

    fireEvent.click(screen.getByText('Hamburger'));
    expect(screen.getByText('Drawer Open')).toBeInTheDocument();

    fireEvent.click(screen.getByText('OverlayClose'));

    expect(screen.getByText('Drawer Closed')).toBeInTheDocument();

    expect(document.body.style.overflow).toBe('');
  });
});
