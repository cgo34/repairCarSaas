import { SettingPriceDiameterCoefficientViewDto } from "@/@application/dtos/settings/SettingPriceDiameterCoefficientViewType";

export interface ISettingPriceDiameterCoefficientUseCase {
  getByUserId(userId: string): Promise<SettingPriceDiameterCoefficientViewDto[]>;
  create(dto: SettingPriceDiameterCoefficientViewDto): Promise<SettingPriceDiameterCoefficientViewDto>;
  update(dto: SettingPriceDiameterCoefficientViewDto): Promise<SettingPriceDiameterCoefficientViewDto>;
  delete(id: string): Promise<void>;
}
