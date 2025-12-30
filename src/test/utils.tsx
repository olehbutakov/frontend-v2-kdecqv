import type { ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { I18nProvider } from '../i18n/I18nContext';
import type { Locale } from '../i18n/types';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialRoute?: string;
  locale?: Locale;
}

/**
 * Custom render that wraps components Router for testing
 */
const customRender = (element: ReactElement, options?: CustomRenderOptions) => {
  const {
    initialRoute = '/',
    locale = 'en-US',
    ...renderOptions
  } = options || {};

  // Set initial route if specified
  if (initialRoute !== '/') {
    window.history.pushState({}, 'Test page', initialRoute);
  }

  return render(element, {
    wrapper: ({ children }) => (
      <I18nProvider defaultLocale={locale}>
        <BrowserRouter>{children}</BrowserRouter>
      </I18nProvider>
    ),
    ...renderOptions,
  });
};

// Re-export everything
/* eslint-disable react-refresh/only-export-components */
export * from '@testing-library/react';
export { customRender as render };
