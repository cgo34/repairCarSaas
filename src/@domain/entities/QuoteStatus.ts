export const QUOTE_STATUSES = [
  'cancel',
  'draft',
  'pending',
  'validated',
  'accepted',
  'signed',
  'sent'
] as const;

export type QuoteStatus = typeof QUOTE_STATUSES[number];
