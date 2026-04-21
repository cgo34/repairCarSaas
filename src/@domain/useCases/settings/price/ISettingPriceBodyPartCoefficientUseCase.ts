import { SettingPriceBodyPartCoefficientDto } from "@/@application/dtos/settings/price/SettingPriceBodyPartCoefficientDto";

export interface ISettingPriceBodyPartCoefficientUseCase {
  getAdmin(): Promise<SettingPriceBodyPartCoefficientDto[]>;
  getByUserId(userId: string): Promise<SettingPriceBodyPartCoefficientDto[]>;
  save(dtos: SettingPriceBodyPartCoefficientDto[]): Promise<SettingPriceBodyPartCoefficientDto[]>;
  create(dto: SettingPriceBodyPartCoefficientDto): Promise<SettingPriceBodyPartCoefficientDto>;
  update(dto: SettingPriceBodyPartCoefficientDto): Promise<SettingPriceBodyPartCoefficientDto>;
  delete(id: string): Promise<void>;
}
