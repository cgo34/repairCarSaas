import { computed } from 'vue';
import { useLocale as useVuetifyLocale } from 'vuetify';
import { i18n, saveLocale, SUPPORTED_LOCALES, type AppLocale } from '@/app/i18n';

// Current language and its setter. Keeps vue-i18n, Vuetify components and the
// saved preference in sync so the whole UI switches at once.
export function useLocale() {
  const vuetifyLocale = useVuetifyLocale();

  const locale = computed(() => i18n.global.locale.value as AppLocale);

  const setLocale = (next: AppLocale) => {
    i18n.global.locale.value = next;
    vuetifyLocale.current.value = next;
    saveLocale(next);
    document.documentElement.lang = next;
  };

  return { locale, setLocale, supportedLocales: SUPPORTED_LOCALES };
}
