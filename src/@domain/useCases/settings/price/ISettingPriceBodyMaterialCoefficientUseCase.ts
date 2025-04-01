import { SettingPriceBodyMaterialCoefficientViewDto } from "@/@application/dtos/settings/SettingPriceBodyMaterialCoefficientViewDto";

export interface ISettingPriceBodyMaterialCoefficientUseCase {
  getByUserId(userId: string): Promise<SettingPriceBodyMaterialCoefficientViewDto[]>;
  create(dto: SettingPriceBodyMaterialCoefficientViewDto): Promise<SettingPriceBodyMaterialCoefficientViewDto>;
  update(dto: SettingPriceBodyMaterialCoefficientViewDto): Promise<SettingPriceBodyMaterialCoefficientViewDto>;
  delete(bodyMaterialId: string, userId: string): Promise<void>;
}
