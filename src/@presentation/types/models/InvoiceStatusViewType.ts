export const invoiceStatusViewTypes = [
  'pending', 'cancel', 'draft', 'validated', 'accepted', 'signed', 'sent', 'draft'
] as const;
export type InvoiceStatusViewType = typeof invoiceStatusViewTypes[number];