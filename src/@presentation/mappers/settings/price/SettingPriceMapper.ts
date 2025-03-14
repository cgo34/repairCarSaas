import { SettingPriceDto } from "@/@application/dtos/settings/price/SettingPriceDto";
import { SettingPriceViewModel } from "@/@presentation/types/models/settings/price/SettingPriceViewModel";
import { SettingPriceBodyMaterialCoefficientMapper } from "./SettingPriceBodyMaterialCoefficientMapper";
import { SettingPriceBodyPartCoefficientMapper } from "./SettingPriceBodyPartCoefficientMapper";
import { SettingPriceDiameterCoefficientMapper } from "./SettingPriceDiameterCoefficientMapper";
import { SettingPriceImpactCountToUtMapper } from "./SettingPriceImpactCountToUtMapper";

export class SettingPriceMapper {
  static viewToDto(viewModel: SettingPriceViewModel): SettingPriceDto {
    return {
      general: viewModel.general,
      bodyMaterials: viewModel.bodyMaterials.map((bm) => SettingPriceBodyMaterialCoefficientMapper.viewToDto(bm)),
      bodyParts: viewModel.bodyParts.map((bp) => SettingPriceBodyPartCoefficientMapper.viewToDto(bp)),
      diameters: viewModel.diameters.map((bp) => SettingPriceDiameterCoefficientMapper.viewToDto(bp)),
      impactsCount: viewModel.impactsCount.map((bp) => SettingPriceImpactCountToUtMapper.viewToDto(bp)),
    };
  }

  static dtoToView(dto: SettingPriceDto): SettingPriceViewModel {
    return {
      general: dto.general,
      bodyMaterials: dto.bodyMaterials.map((bm) => SettingPriceBodyMaterialCoefficientMapper.dtoToView(bm)),
      bodyParts: dto.bodyParts.map((bp) => SettingPriceBodyPartCoefficientMapper.dtoToView(bp)),
      diameters: dto.diameters.map((bp) => SettingPriceDiameterCoefficientMapper.dtoToView(bp)),
      impactsCount: dto.impactsCount.map((bp) => SettingPriceImpactCountToUtMapper.dtoToView(bp)),
    };
  }
}