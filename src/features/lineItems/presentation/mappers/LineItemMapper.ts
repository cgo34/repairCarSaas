import { LineItemDto } from '@/features/lineItems/application/dtos/LineItemDto';
import { LineItemViewModel } from '@/features/lineItems/presentation/models/LineItemViewModel';

export class LineItemMapper {
  static viewToDto(viewModel: LineItemViewModel): LineItemDto {
    return {
      id: viewModel.id ?? '',
      quoteId: viewModel.quoteId ?? undefined, // ❌ Pas encore rattaché à un devis
      invoiceId: viewModel.invoiceId ?? undefined,
      bodyPartId: viewModel.bodyPart?.id ?? '',
      bodyPart: viewModel.bodyPart ?? undefined,
      bodyMaterialId: viewModel.bodyMaterial?.id ?? '',
      bodyMaterial: viewModel.bodyMaterial ?? undefined,
      repairTypeId: viewModel.repairType?.id ?? '',
      repairType: viewModel.repairType ?? undefined,
      impactCount25: viewModel.impactCount25 ?? 0,
      impactCount35: viewModel.impactCount35 ?? 0,
      dentRemovalPrice: viewModel.dentRemovalPrice ?? 0,
      price: viewModel.price // Prix sera calculé plus tard
    };
  }

  static dtoToView(dto: LineItemDto): LineItemViewModel {
    return {
      id: dto.id ?? undefined,
      quoteId: dto.quoteId,
      bodyPartId: dto.bodyPartId,
      bodyPart: dto.bodyPart,
      bodyMaterialId: dto.bodyMaterialId,
      bodyMaterial: dto.bodyMaterial,
      repairTypeId: dto.repairTypeId,
      repairType: dto.repairType,
      impactCount25: dto.impactCount25,
      impactCount35: dto.impactCount35,
      dentRemovalPrice: dto.dentRemovalPrice,
      lineItemType: 'quote',
      price: dto.price ?? 0
    };
  }
}
