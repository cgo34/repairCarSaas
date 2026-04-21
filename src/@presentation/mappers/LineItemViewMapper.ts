import { BodyPartViewModel } from "@/@presentation/types/models/carRepair/BodyPartViewModel";
import { BodyMaterialViewModel } from "@/@presentation/types/models/carRepair/BodyMaterialViewModel";
import { DentRepairTypeViewModel } from "@/@presentation/types/models/carRepair/DentRepairTypeViewModel";
import { LineItemViewModel } from "@/@presentation/types/models/LineItemViewModel";
import { LineItemViewDto } from "@/@application/dtos/LineItemViewDto";
import { LineItemDto } from "@/@application/dtos/LineItemDto";

export class LineItemViewMapper {
  static viewToDto(viewModel: LineItemViewModel): LineItemDto {
    return {
      id: viewModel.id,
      quoteId: viewModel.quoteId,
      bodyPartId: viewModel.bodyPartId ?? viewModel.bodyPart?.id ?? '',
      bodyPart: viewModel.bodyPart,
      bodyMaterialId: viewModel.bodyMaterialId ?? viewModel.bodyMaterial?.id ?? '',
      bodyMaterial: viewModel.bodyMaterial,
      repairTypeId: viewModel.repairTypeId ?? viewModel.repairType?.id ?? '',
      repairType: viewModel.repairType,
      // repairTypeCode: viewModel.repairType?.code ?? undefined,
      impactCount25: viewModel.impactCount25 ?? 0,
      impactCount35: viewModel.impactCount35 ?? 0,
      dentRemovalPrice: viewModel.dentRemovalPrice ?? 0,
      price: viewModel.price
    };
  }

  static dtoToView(dto: LineItemDto): LineItemViewModel {
    return {
      id: dto.id,
      quoteId: dto.quoteId,
      bodyPartId: dto.bodyPartId,
      bodyPart: dto.bodyPart ?? undefined,
      bodyMaterialId: dto.bodyMaterialId,
      bodyMaterial: dto.bodyMaterial ?? undefined,
      repairTypeId: dto.repairTypeId,
      repairType: dto.repairType ?? undefined,
      impactCount25: dto.impactCount25,
      impactCount35: dto.impactCount35,
      dentRemovalPrice: dto.dentRemovalPrice,
      price: dto.price ?? 0
    };
  }

  static dtoToViewEnriched(
    dto: LineItemDto,
    bodyParts: BodyPartViewModel[],
    bodyMaterials: BodyMaterialViewModel[],
    repairTypes: DentRepairTypeViewModel[]
  ): LineItemViewModel {
    const base = LineItemViewMapper.dtoToView(dto);
    return {
      ...base,
      bodyPart: bodyParts.find(bp => bp.id === base.bodyPartId),
      bodyMaterial: bodyMaterials.find(bm => bm.id === base.bodyMaterialId),
      repairType: repairTypes.find(rt => rt.id === base.repairTypeId),
    };
  }
}
