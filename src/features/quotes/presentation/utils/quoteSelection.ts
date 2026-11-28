export const QUOTE_GUID_STORAGE_KEY = 'dentrepaircar:quote:selectedGuid';

// Selected quote id, persisted in localStorage so it is not exposed in the URL.
export function getSelectedQuoteGuid(): string | null {
  return localStorage.getItem(QUOTE_GUID_STORAGE_KEY);
}

export function setSelectedQuoteGuid(guid: string): void {
  localStorage.setItem(QUOTE_GUID_STORAGE_KEY, guid);
}

export function clearSelectedQuoteGuid(): void {
  localStorage.removeItem(QUOTE_GUID_STORAGE_KEY);
}