import { LineItemApiModel } from "../database/api/LineItemApiModel";
import { LineItemDto } from "../dtos/LineItemDto";

export class LineItemMapper {
  static apiToDto(apiModel: LineItemApiModel): LineItemDto {
    return {
      id: apiModel.id,
      quoteId: apiModel.quote_id,
      bodyPartId: apiModel.body_part_id,
      bodyMaterialId: apiModel.body_material_id,
      repairTypeId: apiModel.repair_type_id,
      impactCount25: apiModel.impact_count_25,
      impactCount35: apiModel.impact_count_35,
      dentRemovalPrice: apiModel.dent_removal_price,
      price: apiModel.price
    };
  }

  static dtoToApi(dto: LineItemDto): LineItemApiModel {
    return {
      ...(dto.id && { id: dto.id }),
      quote_id: dto.quoteId,
      body_part_id: dto.bodyPartId,
      body_material_id: dto.bodyMaterialId,
      repair_type_id: dto.repairTypeId,
      impact_count_25: dto.impactCount25,
      impact_count_35: dto.impactCount35,
      dent_removal_price: dto.dentRemovalPrice,
      price: dto.price
    };
  }
}