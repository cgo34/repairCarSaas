import { SettingPriceBodyPartCoefficientViewDto } from "@/@application/dtos/settings/SettingPriceBodyPartCoefficientViewType";

export interface ISettingPriceBodyPartCoefficientUseCase {
  getAdmin(): Promise<SettingPriceBodyPartCoefficientViewDto[]>;
  getByUserId(userId: string): Promise<SettingPriceBodyPartCoefficientViewDto[]>;
  save(dto: SettingPriceBodyPartCoefficientViewDto[]): Promise<SettingPriceBodyPartCoefficientViewDto[]>;
  create(dto: SettingPriceBodyPartCoefficientViewDto): Promise<SettingPriceBodyPartCoefficientViewDto>;
  update(dto: SettingPriceBodyPartCoefficientViewDto): Promise<SettingPriceBodyPartCoefficientViewDto>;
  delete(id: string): Promise<void>;
}
