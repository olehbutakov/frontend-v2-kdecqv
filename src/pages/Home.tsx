import { useI18n } from '../i18n/I18nContext';

export const Home = () => {
  const { t } = useI18n();

  return (
    <div>
      <h1>{t('app.hello')}</h1>
      <p>Nice to meet you!</p>
    </div>
  );
};
