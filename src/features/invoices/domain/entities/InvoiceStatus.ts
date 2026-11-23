export const INVOICE_STATUSES = [
  'cancel',
  'draft',
  'pending',
  'validated',
  'accepted',
  'signed',
  'sent'
] as const;

export type InvoiceStatus = typeof INVOICE_STATUSES[number];
