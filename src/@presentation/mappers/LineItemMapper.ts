import { LineItemViewDto } from '@/@application/dtos/LineItemViewDto';
import { LineItemViewModel } from '@/@presentation/types/models/LineItemViewModel';

export class LineItemMapper {
  static viewToDto(viewModel: LineItemViewModel): LineItemViewDto {
    return {
      id: viewModel.id?.toString() ?? crypto.randomUUID(),
      quoteId: undefined, // ❌ Pas encore rattaché à un devis
      bodyPartId: viewModel.bodyPart?.id ?? '',
      bodyMaterialId: viewModel.bodyMaterial?.id ?? '',
      repairTypeId: viewModel.repairType?.id ?? '',
      impactCount25: viewModel.impactCount25 ?? 0,
      impactCount35: viewModel.impactCount35 ?? 0,
      dentRemovalPrice: viewModel.dentRemovalPrice ?? 0,
      price: 0 // Prix sera calculé plus tard
    };
  }
}
