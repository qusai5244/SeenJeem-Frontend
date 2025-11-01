import i18next from 'i18next';
import { getStorage } from 'minimal-shared/utils';
import resourcesToBackend from 'i18next-resources-to-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next, I18nextProvider as Provider } from 'react-i18next';

import { i18nOptions, fallbackLng } from './locales-config';

// ----------------------------------------------------------------------

/**
 * [1] localStorage
 * Auto detection:
 * const lng = getStorage('i18nextLng')
 *
 */


const lng = getStorage('i18nextLng', fallbackLng) as string;

i18next.on("languageChanged", (newLng) => {
  document.documentElement.dir = newLng === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = newLng;
});


i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .use(resourcesToBackend((lang: string, ns: string) => import(`./langs/${lang}/${ns}.json`)))
  .init({
    ...i18nOptions(lng),
    detection: {
      caches: ['localStorage'],
      order: ['localStorage', 'navigator'],
    },
  });



// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function I18nProvider({ children }: Props) {


  return <Provider i18n={i18next}>{children}</Provider>;
}
