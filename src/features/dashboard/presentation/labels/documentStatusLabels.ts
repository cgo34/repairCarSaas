export interface StatusChip {
  label: string;
  color: string;
}

const QUOTE_STATUSES: Record<string, StatusChip> = {
  draft: { label: 'Brouillon', color: 'default' },
  processing: { label: 'En cours', color: 'warning' },
  pending: { label: 'En attente', color: 'warning' },
  finalized: { label: 'Finalisé', color: 'info' },
  accepted: { label: 'Accepté', color: 'success' },
  signed: { label: 'Signé', color: 'success' },
  invoiced: { label: 'Facturé', color: 'secondary' },
  refused: { label: 'Refusé', color: 'error' },
  cancelled: { label: 'Annulé', color: 'error' },
};

const INVOICE_STATUSES: Record<string, StatusChip> = {
  draft: { label: 'Brouillon', color: 'default' },
  pending: { label: 'En attente', color: 'warning' },
  validated: { label: 'Payée', color: 'success' },
  accepted: { label: 'Payée', color: 'success' },
  signed: { label: 'Payée', color: 'success' },
  sent: { label: 'Envoyée', color: 'primary' },
  cancel: { label: 'Annulée', color: 'error' },
};

const resolve = (map: Record<string, StatusChip>, code: string | undefined): StatusChip =>
  (code && map[code]) || { label: code ?? '—', color: 'default' };

export const quoteStatusChip = (code: string | undefined) => resolve(QUOTE_STATUSES, code);
export const invoiceStatusChip = (code: string | undefined) => resolve(INVOICE_STATUSES, code);
