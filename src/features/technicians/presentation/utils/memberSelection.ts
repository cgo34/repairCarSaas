export const MEMBER_ID_STORAGE_KEY = 'dentrepaircar:member:selectedId';

// Selected member id, persisted in localStorage so it is not exposed in the URL.
export function getSelectedMemberId(): string | null {
  return localStorage.getItem(MEMBER_ID_STORAGE_KEY);
}

export function setSelectedMemberId(id: string): void {
  localStorage.setItem(MEMBER_ID_STORAGE_KEY, id);
}

export function clearSelectedMemberId(): void {
  localStorage.removeItem(MEMBER_ID_STORAGE_KEY);
}
