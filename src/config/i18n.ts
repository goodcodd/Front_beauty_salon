import i18n from 'i18next';
import Backend from 'i18next-fs-backend';
import path from 'path';

i18n
  .use(Backend)
  .init({
    fallbackLng: 'en',
    lng: 'en',
    backend: {
      loadPath: path.join(__dirname, '../locales/{{lng}}/translation.json')
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;