import { i18n } from '@/app/i18n';

// Locale tag used by Intl for the current UI language.
export const intlLocale = (): string => (i18n.global.locale.value === 'en' ? 'en-GB' : 'fr-FR');

// Reads the locale ref, so anything calling these in a template/computed re-renders on language change.
export const formatCurrency = (value: number, currency = 'EUR'): string =>
  new Intl.NumberFormat(intlLocale(), { style: 'currency', currency }).format(value);

export const formatDate = (value: string | Date, options: Intl.DateTimeFormatOptions = {}): string =>
  new Date(value).toLocaleDateString(intlLocale(), options);

export const capitalize = (text: string): string => text.charAt(0).toUpperCase() + text.slice(1);
