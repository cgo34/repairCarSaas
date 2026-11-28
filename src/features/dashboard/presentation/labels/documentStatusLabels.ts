import { i18n } from '@/app/i18n';

export interface StatusChip {
  label: string;
  color: string;
}

const QUOTE_STATUSES: Record<string, StatusChip> = {
  draft: { label: 'draft', color: 'default' },
  processing: { label: 'processing', color: 'warning' },
  pending: { label: 'pending', color: 'warning' },
  finalized: { label: 'finalized', color: 'info' },
  accepted: { label: 'accepted', color: 'success' },
  signed: { label: 'signed', color: 'success' },
  invoiced: { label: 'invoiced', color: 'secondary' },
  refused: { label: 'refused', color: 'error' },
  cancelled: { label: 'cancelled', color: 'error' },
};

const INVOICE_STATUSES: Record<string, StatusChip> = {
  draft: { label: 'draft', color: 'default' },
  pending: { label: 'pending', color: 'warning' },
  validated: { label: 'paid', color: 'success' },
  accepted: { label: 'paid', color: 'success' },
  signed: { label: 'paid', color: 'success' },
  sent: { label: 'sent', color: 'primary' },
  cancel: { label: 'cancelledInvoice', color: 'error' },
};

const resolve = (map: Record<string, StatusChip>, code: string | undefined): StatusChip =>
  code && map[code]
    ? { ...map[code], label: i18n.global.t(`dashboard.status.${map[code].label}`) as string }
    : { label: code ?? '—', color: 'default' };

export const quoteStatusChip = (code: string | undefined) => resolve(QUOTE_STATUSES, code);
export const invoiceStatusChip = (code: string | undefined) => resolve(INVOICE_STATUSES, code);
