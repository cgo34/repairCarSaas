export const QUOTE_STATUSES = [
  'cancel',
  'draft',
  'pending',
  'processing',
  'validated',
  'accepted',
  'signed',
  'sent'
] as const;

export type QuoteStatusDto = typeof QUOTE_STATUSES[number];
