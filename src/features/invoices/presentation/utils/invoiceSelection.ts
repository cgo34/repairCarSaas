export const INVOICE_GUID_STORAGE_KEY = 'dentrepaircar:invoice:selectedGuid';

// Selected invoice id, persisted in localStorage so it is not exposed in the URL
// (same mechanism as the selected quote).
export function getSelectedInvoiceGuid(): string | null {
  return localStorage.getItem(INVOICE_GUID_STORAGE_KEY);
}

export function setSelectedInvoiceGuid(guid: string): void {
  localStorage.setItem(INVOICE_GUID_STORAGE_KEY, guid);
}

export function clearSelectedInvoiceGuid(): void {
  localStorage.removeItem(INVOICE_GUID_STORAGE_KEY);
}
