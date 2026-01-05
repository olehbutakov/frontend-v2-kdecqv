import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LanguageSwitcher } from '../LanguageSwitcher.tsx';
import type { Option } from '../../CustomSelect/CustomSelect.tsx';

const setLocaleMock = jest.fn();

jest.mock('../../../../i18n/I18nContext', () => ({
  useI18n: () => ({
    locale: 'en',
    setLocale: setLocaleMock,
  }),
}));

jest.mock('../../../../i18n/types', () => ({
  LOCALE_INFO: {
    en: { name: 'English US' },
    fr: { name: 'French Canada' },
  },
}));

jest.mock('../../CustomSelect/CustomSelect', () => ({
  CustomSelect: ({
    options,
    value,
    onChange,
  }: {
    options: Option[];
    value: string;
    onChange: (val: string) => void;
  }) => (
    <div>
      <div>CustomSelect</div>
      <button onClick={() => onChange('fr')}>Select French</button>
      <span data-testid="current-value">{value}</span>
      <ul>
        {options.map((o) => (
          <li key={o.value}>{o.label}</li>
        ))}
      </ul>
    </div>
  ),
}));

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders CustomSelect with current locale', () => {
    render(<LanguageSwitcher />);

    expect(screen.getByText('CustomSelect')).toBeInTheDocument();
    expect(screen.getByTestId('current-value')).toHaveTextContent('en');

    expect(screen.getByText('English US')).toBeInTheDocument();
    expect(screen.getByText('French Canada')).toBeInTheDocument();
  });

  it('calls setLocale when selection changes', () => {
    render(<LanguageSwitcher />);

    fireEvent.click(screen.getByText('Select French'));

    expect(setLocaleMock).toHaveBeenCalledTimes(1);
    expect(setLocaleMock).toHaveBeenCalledWith('fr');
  });
});
