import { i18n } from '@/app/i18n';

// Translates a value coming from the database through its stable `code`
// (e.g. body part "porte-avant-gauche"). Falls back to the stored name when
// no translation exists, so a new code never shows a raw key.
// Plain function (not a composable) so templates, composables and PDF templates can all use it.
export const translateCode = (group: string, code: string | undefined, fallbackName = ''): string => {
  if (!code) return fallbackName;
  return i18n.global.t(`${group}.${code}`, fallbackName);
};
