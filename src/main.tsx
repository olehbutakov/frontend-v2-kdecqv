import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { I18nProvider } from './i18n/I18nContext.tsx';
import './index.css';
import App from './App.tsx';
import { ProductsProvider } from './context/ProductContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <I18nProvider defaultLocale="en-US">
        <ProductsProvider>
          <App />
        </ProductsProvider>
      </I18nProvider>
    </BrowserRouter>
  </StrictMode>
);
