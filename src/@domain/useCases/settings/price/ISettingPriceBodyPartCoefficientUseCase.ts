import { SettingPriceBodyPartCoefficientViewDto } from "@/@application/dtos/settings/SettingPriceBodyPartCoefficientViewType";

export interface ISettingPriceBodyPartCoefficientUseCase {
  getByUserId(userId: string): Promise<SettingPriceBodyPartCoefficientViewDto[]>;
  create(dto: SettingPriceBodyPartCoefficientViewDto): Promise<SettingPriceBodyPartCoefficientViewDto>;
  update(dto: SettingPriceBodyPartCoefficientViewDto): Promise<SettingPriceBodyPartCoefficientViewDto>;
  delete(id: string): Promise<void>;
}
