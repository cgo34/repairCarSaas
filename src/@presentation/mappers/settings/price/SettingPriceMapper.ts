import { SettingPriceViewDto } from "@/@application/dtos/settings/SettingPriceViewDto";
import { SettingPriceViewModel } from "@/@presentation/types/models/settings/price/SettingPriceViewModel";
import { SettingPriceBodyMaterialCoefficientMapper } from "./SettingPriceBodyMaterialCoefficientMapper";
import { SettingPriceBodyPartCoefficientMapper } from "./SettingPriceBodyPartCoefficientMapper";
import { SettingPriceDiameterCoefficientMapper } from "./SettingPriceDiameterCoefficientMapper";
import { SettingPriceGeneralMapper } from "./SettingPriceGeneralMapper";
import { SettingPriceImpactCountToUtMapper } from "./SettingPriceImpactCountToUtMapper";
import { SettingPriceRepairTypeCoefficientMapper } from "./SettingPriceRepairTypeCoefficientMapper";

export class SettingPriceMapper {
  static viewToDto(viewModel: SettingPriceViewModel): SettingPriceViewDto {
    return {
      general: SettingPriceGeneralMapper.viewToDto(viewModel.general),
      bodyMaterials: viewModel.bodyMaterials.map((bm) => SettingPriceBodyMaterialCoefficientMapper.viewToDto(bm)),
      bodyParts: viewModel.bodyParts.map((bp) => SettingPriceBodyPartCoefficientMapper.viewToDto(bp)),
      diameters: viewModel.diameters.map((bp) => SettingPriceDiameterCoefficientMapper.viewToDto(bp)),
      impactsCount: viewModel.impactsCount.map((bp) => SettingPriceImpactCountToUtMapper.viewToDto(bp)),
      repairTypes: viewModel.repairTypes.map((rt) => SettingPriceRepairTypeCoefficientMapper.viewToDto(rt)),
    };
  }

  static dtoToView(dto: SettingPriceViewDto): SettingPriceViewModel {
    return {
      general: dto.general,
      bodyMaterials: dto.bodyMaterials.map((bm) => SettingPriceBodyMaterialCoefficientMapper.dtoToView(bm)),
      bodyParts: dto.bodyParts.map((bp) => SettingPriceBodyPartCoefficientMapper.dtoToView(bp)),
      diameters: dto.diameters.map((bp) => SettingPriceDiameterCoefficientMapper.dtoToView(bp)),
      impactsCount: dto.impactsCount.map((bp) => SettingPriceImpactCountToUtMapper.dtoToView(bp)),
      repairTypes: dto.repairTypes.map((rt) => SettingPriceRepairTypeCoefficientMapper.dtoToView(rt)),
    };
  }
}