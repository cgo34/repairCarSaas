import { InvoiceLineItem } from '@domain/entities/InvoiceLineItem';
import { InvoiceStatus } from './InvoiceStatus';

export class Invoice {
  private _lineItems: InvoiceLineItem[] = [];

  constructor(
    public readonly id: string,
    public quoteNumber: string,
    public invoiceNumber: string,
    public isForfait: boolean,
    public forfaitAmount: number | null,
    public startDate: Date,
    public endDate: Date,
    public status: InvoiceStatus,
    public country: string,
    public currency: string,
    public isSent: boolean,
    public sentAt: Date | null,
    public carBrand: string,
    public carId: string,
    public carDate: string,
    public technicianId: string,
    public garageId: string,
    public userId: string, // 🔹 ID du créateur du devis
    lineItems?: InvoiceLineItem[] // 👈 Permet d'initialiser les lignes
  ) {
    if (lineItems) {
      this._lineItems = lineItems;
    }
  }

  /**
   * 🔹 Récupérer les lignes du devis.
   */
  get lineItems(): InvoiceLineItem[] {
    return this._lineItems;
  }

  /**
   * 🔹 Ajouter une ligne au devis.
   */
  addLineItem(lineItem: InvoiceLineItem): void {
    this._lineItems.push(lineItem);
  }

  /**
   * 🔹 Supprimer une ligne du devis.
   */
  removeLineItem(lineItemId: string): void {
    this._lineItems = this._lineItems.filter(item => item.id !== lineItemId);
  }

  /**
   * 🔹 Mettre à jour une ligne existante.
   */
  updateLineItem(updatedItem: InvoiceLineItem): void {
    const index = this._lineItems.findIndex(item => item.id === updatedItem.id);
    if (index !== -1) {
      this._lineItems[index] = updatedItem;
    }
  }

  /**
   * 🔹 Vérifie si le devis est expiré.
   */
  isExpired(): boolean {
    const endDate = new Date(this.endDate);
    
    return new Date() > endDate;
  }

  /**
   * 🔹 Marque le devis comme envoyé.
   */
  markAsSent(): void {
    this.isSent = true;
    this.sentAt = new Date();
  }

  /**
   * 🔹 Met à jour le statut du devis.
   */
  updateStatus(newStatus: InvoiceStatus): void {
    this.status = newStatus;
  }

  /**
   * 🔹 Applique un forfait.
   */
  applyForfait(amount: number): void {
    this.isForfait = true;
    this.forfaitAmount = amount;
  }

  /**
   * 🔹 Calcule le total du devis.
   */
  calculateTotal(): number {
    if (this.isForfait && this.forfaitAmount !== null) {
      return this.forfaitAmount;
    }
    return this._lineItems.reduce((sum, item) => sum + item.price, 0);
  }

  /**
   * 🔹 Convertit en JSON (ex: pour l’API).
   */
  toJSON() {
    return {
      id: this.id,
      invoiceNumber: this.invoiceNumber,
      quoteNumber: this.quoteNumber,
      isForfait: this.isForfait,
      forfaitAmount: this.forfaitAmount,
      startDate: this.startDate.toISOString(),
      endDate: this.endDate.toISOString(),
      status: this.status,
      country: this.country,
      currency: this.currency,
      isSent: this.isSent,
      sentAt: this.sentAt ? this.sentAt.toISOString() : null,
      carBrand: this.carBrand,
      carId: this.carId,
      carDate: this.carDate,
      technicianId: this.technicianId,
      garageId: this.garageId,
      lineItems: this._lineItems.map(item => item.toJSON()) // 👈 Sérialisation des lignes
    };
  }
}
