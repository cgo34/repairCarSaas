export class QuoteLineItem {
  constructor(
    public readonly id: string | undefined,
    public readonly quoteId: string | undefined,
    public bodyPartId: string | undefined,
    public bodyMaterialId: string | undefined,
    public repairTypeId: string | undefined,
    public impactCount25: number | undefined,
    public impactCount35: number | undefined,
    public dentRemovalPrice: number | undefined,
    public price: number | undefined
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
      dentRemovalPrice: this.dentRemovalPrice,
      price: this.price
    };
  }
}
