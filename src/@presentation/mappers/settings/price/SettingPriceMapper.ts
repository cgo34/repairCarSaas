import { SettingPriceViewDto } from "@/@application/dtos/settings/SettingPriceViewDto";
import { SettingPriceViewModel } from "@/@presentation/types/models/settings/price/SettingPriceViewModel";
import { SettingPriceBodyPartCoefficientMapper } from "./SettingPriceBodyPartCoefficientMapper";
import { SettingPriceGeneralMapper } from "./SettingPriceGeneralMapper";
import { SettingPriceImpactCountToUtMapper } from "./SettingPriceImpactCountToUtMapper";
import { SettingPriceTechnicityCoefficientMapper } from "./SettingPriceTechnicityCoefficientMapper";

export class SettingPriceMapper {
  static viewToDto(viewModel: SettingPriceViewModel): SettingPriceViewDto {
    if (!viewModel) throw new Error('[SettingPriceMapper] viewModel is undefined');
    if (!viewModel.general) throw new Error('[SettingPriceMapper] viewModel.general is undefined');
    if (!viewModel.technicity) throw new Error('[SettingPriceMapper] viewModel.technicity is undefined');
    return {
      general: SettingPriceGeneralMapper.viewToDto(viewModel.general),
      technicity: SettingPriceTechnicityCoefficientMapper.viewToDto(viewModel.technicity),
      bodyParts: (viewModel.bodyParts ?? []).map((bp) => SettingPriceBodyPartCoefficientMapper.viewToDto(bp)),
      impactsCount: (viewModel.impactsCount ?? []).map((bp) => SettingPriceImpactCountToUtMapper.viewToDto(bp)),
    };
  }

  static dtoToView(dto: SettingPriceViewDto): SettingPriceViewModel {
    return {
      general: dto.general ?? undefined,
      bodyParts: dto.bodyParts?.map((bp) => SettingPriceBodyPartCoefficientMapper.dtoToView(bp)) ?? [],
      technicity: dto.technicity ? SettingPriceTechnicityCoefficientMapper.dtoToView(dto.technicity) : undefined,
      impactsCount: dto.impactsCount?.map((bp) => SettingPriceImpactCountToUtMapper.dtoToView(bp)) ?? [],
    };
  }
}