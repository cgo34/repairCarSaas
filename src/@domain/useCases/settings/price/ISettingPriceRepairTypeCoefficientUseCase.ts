import { SettingPriceRepairTypeCoefficientViewDto } from "@/@application/dtos/settings/SettingPriceRepairTypeCoefficientViewDto";


export interface ISettingPriceRepairTypeCoefficientUseCase {
  getByUserId(userId: string): Promise<SettingPriceRepairTypeCoefficientViewDto[]>;
  create(dto: SettingPriceRepairTypeCoefficientViewDto): Promise<SettingPriceRepairTypeCoefficientViewDto>;
  update(dto: SettingPriceRepairTypeCoefficientViewDto): Promise<SettingPriceRepairTypeCoefficientViewDto>;
  delete(bodyMaterialId: string, userId: string): Promise<void>;
}
