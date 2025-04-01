export interface LineItemDto {
  id?: string;
  quoteId: string;
  bodyPartId: string;
  bodyMaterialId: string;
  repairTypeId: string;
  impactCount25: number;
  impactCount35: number;
  dentRemovalPrice: number;
  price: number;
}
