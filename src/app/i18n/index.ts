import { createI18n } from 'vue-i18n';
import commonFr from '@/locales/fr.json';
import commonEn from '@/locales/en.json';

export const SUPPORTED_LOCALES = ['fr', 'en'] as const;
export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

const DEFAULT_LOCALE: AppLocale = 'fr';
const STORAGE_KEY = 'dentrepaircar:locale';

const isSupportedLocale = (value: unknown): value is AppLocale =>
  SUPPORTED_LOCALES.includes(value as AppLocale);

// Saved choice first, then the browser language, then French.
export const getInitialLocale = (): AppLocale => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (isSupportedLocale(saved)) return saved;

  const browser = navigator.language?.slice(0, 2);
  return isSupportedLocale(browser) ? browser : DEFAULT_LOCALE;
};

export const saveLocale = (locale: AppLocale) => localStorage.setItem(STORAGE_KEY, locale);

// Each feature exposes its translations in <feature>/presentation/locales/<feature>.<locale>.json.
// A file holds a single root key (the feature name): everything is merged here per locale.
type Messages = Record<string, object>;
const loadFeatureMessages = (modules: Record<string, { default: Messages }>, common: Messages) =>
  Object.values(modules).reduce<Messages>((acc, mod) => ({ ...acc, ...mod.default }), { ...common });

const messages = {
  fr: loadFeatureMessages(
    import.meta.glob<{ default: Messages }>('@/features/**/locales/*.fr.json', { eager: true }),
    commonFr
  ),
  en: loadFeatureMessages(
    import.meta.glob<{ default: Messages }>('@/features/**/locales/*.en.json', { eager: true }),
    commonEn
  ),
};

export const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: DEFAULT_LOCALE,
  messages: messages as { fr: typeof commonFr; en: typeof commonEn },
});
