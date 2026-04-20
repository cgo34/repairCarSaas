import { SettingPriceViewDto } from "@/@application/dtos/settings/SettingPriceViewDto";
import { SettingPriceViewModel } from "@/@presentation/types/models/settings/price/SettingPriceViewModel";
import { SettingPriceBodyPartCoefficientMapper } from "./SettingPriceBodyPartCoefficientMapper";
import { SettingPriceGeneralMapper } from "./SettingPriceGeneralMapper";
import { SettingPriceImpactCountToUtMapper } from "./SettingPriceImpactCountToUtMapper";
import { SettingPriceTechnicityCoefficientMapper } from "./SettingPriceTechnicityCoefficientMapper";
import { SettingPriceDto } from "@/@infrastructure/dtos/settings/price/SettingPriceDto";

export class SettingPriceMapper {
  static viewToDto(viewModel: SettingPriceViewModel): SettingPriceViewDto {
    return {
      general: SettingPriceGeneralMapper.viewToDto(viewModel.general) ?? undefined,
      technicity: SettingPriceTechnicityCoefficientMapper.viewToDto(viewModel.technicity),
      bodyParts: viewModel.bodyParts.map((bp) => SettingPriceBodyPartCoefficientMapper.viewToDto(bp)),
      impactsCount: viewModel.impactsCount.map((bp) => SettingPriceImpactCountToUtMapper.viewToDto(bp)),
    };
  }

  static dtoToView(dto: SettingPriceDto): SettingPriceViewModel {
    return {
      general: dto.general ?? undefined,
      bodyParts: dto.bodyParts.map((bp) => SettingPriceBodyPartCoefficientMapper.dtoToView(bp)) ?? undefined,
      technicity: SettingPriceTechnicityCoefficientMapper.dtoToView(dto.technicity) ?? undefined,
      impactsCount: dto.impactsCount.map((bp) => SettingPriceImpactCountToUtMapper.dtoToView(bp)) ?? undefined,
    };
  }
}