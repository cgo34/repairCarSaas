import { SettingPriceBodyPartCoefficientDto } from '@/@application/dtos/settings/price/SettingPriceBodyPartCoefficientDto';

export interface ISettingPriceBodyPartCoefficientUseCase {
  getByUserId(userId: string): Promise<SettingPriceBodyPartCoefficientDto[]>;
  create(dto: SettingPriceBodyPartCoefficientDto): Promise<SettingPriceBodyPartCoefficientDto>;
  update(dto: SettingPriceBodyPartCoefficientDto): Promise<SettingPriceBodyPartCoefficientDto>;
  delete(id: string): Promise<void>;
}
