import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en/translation.json";
import sq from "./locales/sq/translation.json";

i18n
  .use(LanguageDetector)  // detects browser language
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      sq: { translation: sq },
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      // order to detect language
      order: ['localStorage', 'navigator'],
      // key to store language in localStorage
      caches: ['localStorage'],
      // optional: key name in localStorage
      lookupLocalStorage: 'i18nextLng',
    }
  });

export default i18n;
