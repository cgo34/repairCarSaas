import { LineItemViewModel } from "@/@presentation/types/models/LineItemViewModel";
import { LineItemViewDto } from "@/@application/dtos/LineItemViewDto";

export class LineItemViewMapper {
  static viewToDto(viewModel: LineItemViewModel): LineItemViewDto {
    return {
      id: viewModel.id,
      quoteId: viewModel.quoteId,
      bodyPartId: viewModel.bodyPartId ?? viewModel.bodyPart?.id ?? '',
      bodyMaterialId: viewModel.bodyMaterialId ?? viewModel.bodyMaterial?.id ?? '',
      repairTypeId: viewModel.repairTypeId ?? viewModel.repairType?.id ?? '',
      impactCount25: viewModel.impactCount25 ?? 0,
      impactCount35: viewModel.impactCount35 ?? 0,
      dentRemovalPrice: viewModel.dentRemovalPrice ?? 0,
      price: viewModel.price
    };
  }

  static dtoToView(dto: LineItemViewDto): LineItemViewModel {
    return {
      id: dto.id,
      quoteId: dto.quoteId,
      bodyPartId: dto.bodyPartId,
      bodyMaterialId: dto.bodyMaterialId,
      repairTypeId: dto.repairTypeId,
      impactCount25: dto.impactCount25,
      impactCount35: dto.impactCount35,
      dentRemovalPrice: dto.dentRemovalPrice,
      price: dto.price ?? 0
    };
  }
}
