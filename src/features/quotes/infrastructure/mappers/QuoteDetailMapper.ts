import { QuoteDetailApiModel } from '@/features/quotes/infrastructure/api/QuoteDetailApiModel';
import { LineItemDto } from '@/features/lineItems/application/dtos/LineItemDto';
import { BodyPartMapper } from '@/features/carRepairSettings/infrastructure/mappers/BodyPartMapper';
import { BodyMaterialMapper } from '@/features/carRepairSettings/infrastructure/mappers/BodyMaterialMapper';
import { DentRepairTypeMapper } from '@/features/carRepairSettings/infrastructure/mappers/DentRepairTypeMapper';

export class QuoteDetailMapper {
  static apiToDto(apiModel: QuoteDetailApiModel): LineItemDto {
    return {
      id: apiModel.id,
      quoteId: apiModel.quote_id,
      quoteDetailId: apiModel.id,
      bodyPartId: apiModel.body_part_id,
      bodyPart: apiModel.body_parts ? BodyPartMapper.apiToDto(apiModel.body_parts) : undefined,
      bodyMaterialId: apiModel.body_material_id,
      bodyMaterial: apiModel.body_materials ? BodyMaterialMapper.apiToDto(apiModel.body_materials) : undefined,
      repairTypeId: apiModel.repair_type_id,
      repairType: apiModel.repair_types ? DentRepairTypeMapper.apiToDto(apiModel.repair_types) : undefined,
      impactCount25: apiModel.impact_count_25,
      impactCount35: apiModel.impact_count_35,
      dentRemovalPrice: apiModel.dent_removal_price,
      price: apiModel.price,
    };
  }

  static dtoToApi(dto: LineItemDto): Omit<QuoteDetailApiModel, 'id'> & { id?: string } {
    return {
      id: dto.quoteDetailId ?? dto.id,
      quote_id: dto.quoteId ?? '',
      body_part_id: dto.bodyPartId,
      body_material_id: dto.bodyMaterialId,
      repair_type_id: dto.repairTypeId,
      impact_count_25: dto.impactCount25,
      impact_count_35: dto.impactCount35,
      dent_removal_price: dto.dentRemovalPrice,
      price: dto.price,
    };
  }
}
