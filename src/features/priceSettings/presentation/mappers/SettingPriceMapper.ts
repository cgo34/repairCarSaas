import { SettingPriceViewModel } from "@/features/priceSettings/presentation/models/SettingPriceViewModel";
import { SettingPriceDto } from "@/features/priceSettings/application/dtos/SettingPriceDto";
import { SettingPriceBodyPartCoefficientMapper } from "./SettingPriceBodyPartCoefficientMapper";
import { SettingPriceGeneralMapper } from "./SettingPriceGeneralMapper";
import { SettingPriceImpactCountToUtMapper } from "./SettingPriceImpactCountToUtMapper";
import { SettingPriceTechnicityCoefficientMapper } from "./SettingPriceTechnicityCoefficientMapper";

export class SettingPriceMapper {
  static viewToDto(viewModel: SettingPriceViewModel): SettingPriceDto {
    return {
      general: SettingPriceGeneralMapper.viewToDto(viewModel.general),
      technicity: SettingPriceTechnicityCoefficientMapper.viewToDto(viewModel.technicity),
      bodyParts: (viewModel.bodyParts ?? []).map((bp) => SettingPriceBodyPartCoefficientMapper.viewToDto(bp)),
      impactsCount: (viewModel.impactsCount ?? []).map((bp) => SettingPriceImpactCountToUtMapper.viewToDto(bp)),
    };
  }

  static dtoToView(dto: SettingPriceDto): SettingPriceViewModel {
    return {
      general: dto.general ?? undefined,
      bodyParts: dto.bodyParts?.map((bp) => SettingPriceBodyPartCoefficientMapper.dtoToView(bp)) ?? [],
      technicity: SettingPriceTechnicityCoefficientMapper.dtoToView(dto.technicity),
      impactsCount: dto.impactsCount?.map((bp) => SettingPriceImpactCountToUtMapper.dtoToView(bp)) ?? [],
    };
  }
}