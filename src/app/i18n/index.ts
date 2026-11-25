import { createI18n } from 'vue-i18n';
import common from '@/locales/fr.json';

// Chaque feature expose ses traductions dans <feature>/presentation/locales/<feature>.fr.json.
// Le fichier ne contient qu'une clé racine (le nom de la feature) : on fusionne tout ici.
const featureModules = import.meta.glob<{ default: Record<string, object> }>(
  '@/features/**/locales/*.fr.json',
  { eager: true }
);

const messagesFr = Object.values(featureModules).reduce<Record<string, object>>(
  (acc, mod) => ({ ...acc, ...mod.default }),
  { ...common }
);

export const i18n = createI18n({
  legacy: false,
  locale: 'fr',
  fallbackLocale: 'fr',
  messages: { fr: messagesFr as typeof common },
});
