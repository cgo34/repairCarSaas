import { i18n } from '@/app/i18n';

export function timeAgo(iso: string): string {
  if (!iso) return '—';
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1)  return i18n.global.t('common.timeAgo.now') as string;
  if (minutes < 60) return i18n.global.t('common.timeAgo.minutes', { n: minutes }) as string;
  const hours = Math.floor(minutes / 60);
  if (hours < 24)   return i18n.global.t('common.timeAgo.hours', { n: hours }) as string;
  const days = Math.floor(hours / 24);
  return i18n.global.t('common.timeAgo.days', { n: days }) as string;
}
