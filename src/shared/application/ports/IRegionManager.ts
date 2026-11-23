// src/core/managers/interfaces/IRegionManager.ts
export interface IRegionManager {
  formatDate(isoDateStr: string): string;
  formatCurrency(amount: number, currency?: string): string;
  formatNumber(value: number): string;
}
