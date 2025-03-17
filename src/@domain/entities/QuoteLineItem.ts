export class QuoteLineItem {
  constructor(
    public readonly id: string,
    public readonly quoteId: string,
    public bodyPartId: string,
    public bodyMaterialId: string,
    public repairTypeId: string,
    public impactCount25: number,
    public impactCount35: number,
    public strippingPercentage: number,
    public price: number
  ) {}

  /**
   * 🔹 Convertit l’objet en format JSON (ex: pour l’API).
   */
  toJSON() {
    return {
      id: this.id,
      quoteId: this.quoteId,
      bodyPartId: this.bodyPartId,
      bodyMaterialId: this.bodyMaterialId,
      repairTypeId: this.repairTypeId,
      impactCount25: this.impactCount25,
      impactCount35: this.impactCount35,
      strippingPercentage: this.strippingPercentage,
      price: this.price
    };
  }
}
