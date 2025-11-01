import { CONFIG } from 'src/global-config';
import { themeConfig } from 'src/theme/theme-config';

import type { SettingsState } from './types';
import { fallbackLng } from 'src/locales';
import { getStorage, setStorage } from 'minimal-shared/utils';
import i18next from 'i18next';

// ----------------------------------------------------------------------

export const SETTINGS_STORAGE_KEY: string = 'app-settings';
const lng = getStorage('i18nextLng', fallbackLng) as string;


export let defaultSettings: SettingsState = {
  colorScheme: themeConfig.defaultMode,
  direction: lng === "ar" ? "rtl" : "ltr",
  contrast: 'default',
  navLayout: 'vertical',
  primaryColor: 'default',
  navColor: 'integrate',
  compactLayout: true,
  fontSize: 16,
  fontFamily: themeConfig.fontFamily.primary,
  version: CONFIG.appVersion,
};

i18next.on('languageChanged', (newLng: string) => {
  setStorage('i18nextLng', newLng);

  defaultSettings = {
    ...defaultSettings,
    direction: newLng === 'ar' ? 'rtl' : 'ltr',
  };

  setStorage(SETTINGS_STORAGE_KEY, defaultSettings);
  document.documentElement.dir = newLng === 'ar' ? 'rtl' : 'ltr';
});



