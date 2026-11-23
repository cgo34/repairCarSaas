export class InvoiceLineItem {
  constructor(
    public readonly id: string | undefined,
    public readonly invoiceId: string | undefined,
    public bodyPartId: string | undefined,
    public bodyMaterialId: string | undefined,
    public repairTypeId: string | undefined,
    public impactCount25: number | undefined,
    public impactCount35: number | undefined,
    public dentRemovalPrice: number | undefined,
    public price: number | undefined
  ) {}

  toJSON() {
    return {
      id: this.id,
      invoiceId: this.invoiceId,
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
