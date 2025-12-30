import { Link, Route, Routes } from 'react-router-dom';
import './App.css';
import { useI18n } from './i18n/I18nContext';
import { LanguageSwitcher } from './components/common/LanguageSwitcher/LanguageSwitcher.tsx';

function App() {
  const { t } = useI18n();

  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/applications">Applications</Link>
        <LanguageSwitcher />
      </nav>

      <Routes>
        <Route path="/" element={<div>{t('app.hello')}</div>} />
        <Route path="/applications" element={<div>{t('app.hello')}</div>} />
      </Routes>
    </div>
  );
}

export default App;
