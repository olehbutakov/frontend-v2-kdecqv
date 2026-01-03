import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nProvider, useI18n } from '../I18nContext';
import type { TranslationKey } from '../types';

jest.mock('../types', () => ({
  translations: {
    'en-US': {
      'app.hello': 'Hello world!',
      item_one: '{{count}} item',
      item_other: '{{count}} items',
    },
    'fr-CA': {
      'app.hello': 'Bonjour le monde!',
      item_one: '{{count}} article',
      item_other: '{{count}} articles',
    },
  },
}));
function TestComponent() {
  const { locale, setLocale, t, formatCurrency, formatNumber } = useI18n();

  return (
    <>
      <div data-testid="locale">{locale}</div>
      <div data-testid="simple">
        {t('app.hello' as unknown as TranslationKey)}
      </div>
      <div data-testid="plural-one">
        {t('item' as unknown as TranslationKey, { count: 1 })}
      </div>
      <div data-testid="plural-other">
        {t('item' as unknown as TranslationKey, { count: 2 })}
      </div>
      <div data-testid="missing">
        {t('missing_key' as unknown as TranslationKey)}
      </div>
      <div data-testid="currency">{formatCurrency(10)}</div>
      <div data-testid="number">{formatNumber(1000)}</div>
      <button onClick={() => setLocale('fr-CA')}>switch</button>
    </>
  );
}

describe('I18nProvider', () => {
  describe('default behavior', () => {
    it('provides default locale', () => {
      render(
        <I18nProvider>
          <TestComponent />
        </I18nProvider>
      );

      expect(screen.getByTestId('locale')).toHaveTextContent('en-US');
    });

    it('translates simple keys', () => {
      render(
        <I18nProvider>
          <TestComponent />
        </I18nProvider>
      );

      expect(screen.getByTestId('simple').textContent).toBeTruthy();
    });
  });

  describe('pluralization', () => {
    it('uses singular form when count is 1', () => {
      render(
        <I18nProvider>
          <TestComponent />
        </I18nProvider>
      );

      expect(screen.getByTestId('plural-one').textContent).toContain('1');
    });

    it('uses plural form when count is not 1', () => {
      render(
        <I18nProvider>
          <TestComponent />
        </I18nProvider>
      );

      expect(screen.getByTestId('plural-other').textContent).toContain('2');
    });
  });

  describe('fallback behavior', () => {
    it('returns key when translation is missing', () => {
      render(
        <I18nProvider>
          <TestComponent />
        </I18nProvider>
      );

      expect(screen.getByTestId('missing')).toHaveTextContent('missing_key');
    });
  });

  describe('locale switching', () => {
    it('updates translations after locale change', async () => {
      const user = userEvent.setup();

      render(
        <I18nProvider>
          <TestComponent />
        </I18nProvider>
      );

      const initialText = screen.getByTestId('simple').textContent;

      await user.click(screen.getByText('switch'));

      expect(screen.getByTestId('locale')).toHaveTextContent('fr-CA');
      expect(screen.getByTestId('simple').textContent).not.toBe(initialText);
    });
  });

  describe('formatters', () => {
    it('formats currency using locale default', async () => {
      const user = userEvent.setup();

      render(
        <I18nProvider>
          <TestComponent />
        </I18nProvider>
      );

      const enCurrency = screen.getByTestId('currency').textContent;

      await user.click(screen.getByText('switch'));

      const frCurrency = screen.getByTestId('currency').textContent;

      expect(enCurrency).not.toEqual(frCurrency);
    });

    it('formats numbers according to locale', async () => {
      const user = userEvent.setup();

      render(
        <I18nProvider>
          <TestComponent />
        </I18nProvider>
      );

      const enNumber = screen.getByTestId('number').textContent;

      await user.click(screen.getByText('switch'));

      const frNumber = screen.getByTestId('number').textContent;

      expect(enNumber).not.toEqual(frNumber);
    });
  });
});

describe('useI18n', () => {
  describe('safety', () => {
    it('throws when used outside provider', () => {
      function BadComponent() {
        useI18n();
        return null;
      }

      expect(() => render(<BadComponent />)).toThrow(
        'useI18n must be used within I18nProvider'
      );
    });
  });
});
