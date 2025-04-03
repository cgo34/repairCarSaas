export const quoteStatusViewTypes = [
  'pending', 'cancel', 'draft', 'validated', 'accepted', 'signed', 'sent', 'draft'
] as const;
export type QuoteStatusViewType = typeof quoteStatusViewTypes[number];