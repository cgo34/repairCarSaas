// src/core/managers/RegionManager.ts
import { IRegionManager } from "./interfaces/IRegionManager";

export class RegionManager implements IRegionManager {
  private locale = navigator.language;

  formatDate(isoDateStr: string): string {
    const date = new Date(isoDateStr);
    return date.toLocaleDateString(this.locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  formatCurrency(amount: number, currency = "EUR"): string {
    return new Intl.NumberFormat(this.locale, {
      style: "currency",
      currency,
    }).format(amount);
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat(this.locale).format(value);
  }
}
