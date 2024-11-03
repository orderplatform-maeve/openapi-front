import { i18n, InitOptions, Resource } from 'i18next';

export type Locale = string;

export interface I18nOptions extends Omit<InitOptions, 'resources'> {
  defaultLocale: Locale;
  supportedLocales: Locale[];
  resources: Resource;
}

export type I18nInstance = i18n;
