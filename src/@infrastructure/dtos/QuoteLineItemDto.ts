export interface QuoteLineItemDto {
  id?: string;
  quoteId: string;
  bodyPartId: string;
  bodyMaterialId: string;
  repairTypeId: string;
  impactCount25: number;
  impactCount35: number;
  strippingPercentage: number;
  price: number;
}
