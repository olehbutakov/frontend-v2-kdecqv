import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Drawer } from '../Drawer';
import type { ReactNode } from 'react';

const setLocaleMock = jest.fn();

jest.mock('../../../../i18n/I18nContext', () => ({
  useI18n: () => ({
    t: (key: string) => key,
    locale: 'en',
    setLocale: setLocaleMock,
  }),
}));

jest.mock('../../Header/components/HeaderNavLink/HeaderNavLink', () => ({
  HeaderNavLink: ({ children }: { children: ReactNode }) => <a>{children}</a>,
}));

jest.mock('../../../../i18n/types', () => ({
  LOCALE_INFO: {
    en: { name: 'English US' },
    fr: { name: 'French Canada' },
  },
}));

describe('Drawer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders closed drawer by default', () => {
    render(<Drawer isOpen={false} onClose={jest.fn()} />);

    const drawer = screen
      .getByText('navigation.drawer.title')
      .closest('.drawer');

    expect(drawer).toBeInTheDocument();
    expect(drawer).not.toHaveClass('open');
  });

  it('adds open class when isOpen is true', () => {
    render(<Drawer isOpen={true} onClose={jest.fn()} />);

    const drawer = screen
      .getByText('navigation.drawer.title')
      .closest('.drawer');

    expect(drawer).toHaveClass('open');
  });

  it('renders navigation links', () => {
    render(<Drawer isOpen={true} onClose={jest.fn()} />);

    expect(screen.getByText('navigation.home')).toBeInTheDocument();
    expect(screen.getByText('navigation.applications')).toBeInTheDocument();
  });

  it('renders locale buttons from LOCALE_INFO', () => {
    render(<Drawer isOpen={true} onClose={jest.fn()} />);

    expect(screen.getByText('English US')).toBeInTheDocument();
    expect(screen.getByText('French Canada')).toBeInTheDocument();
  });

  it('marks active locale button', () => {
    render(<Drawer isOpen={true} onClose={jest.fn()} />);

    const activeButton = screen.getByText('English US');

    expect(activeButton).toHaveClass('active');
  });

  it('calls setLocale when locale button is clicked', () => {
    render(<Drawer isOpen={true} onClose={jest.fn()} />);

    fireEvent.click(screen.getByText('French Canada'));

    expect(setLocaleMock).toHaveBeenCalledTimes(1);
    expect(setLocaleMock).toHaveBeenCalledWith('fr');
  });

  it('calls onClose when Escape key is pressed', () => {
    const onClose = jest.fn();

    render(<Drawer isOpen={true} onClose={onClose} />);

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
