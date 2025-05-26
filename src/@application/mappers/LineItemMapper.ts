import { LineItemDto } from "@/@infrastructure/dtos/LineItemDto";

export class LineItemMapper {
  static quoteLineToInvoice(quoteLine: LineItemDto): LineItemDto {
    return {
      quoteDetailId: quoteLine.id,
      bodyPartId: quoteLine.bodyPartId,
      bodyMaterialId: quoteLine.bodyMaterialId,
      repairTypeId: quoteLine.repairTypeId,
      impactCount25: quoteLine.impactCount25,
      impactCount35: quoteLine.impactCount35,
      dentRemovalPrice: quoteLine.dentRemovalPrice,
      price: quoteLine.price,
      bodyPart: quoteLine.bodyPart,
      bodyMaterial: quoteLine.bodyMaterial,
      repairType: quoteLine.repairType
    };
  }

}