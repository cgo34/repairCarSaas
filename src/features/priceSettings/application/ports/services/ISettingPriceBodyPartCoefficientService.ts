import { SettingPriceBodyPartCoefficientDto } from '@/features/priceSettings/application/dtos/SettingPriceBodyPartCoefficientDto';

export interface ISettingPriceBodyPartCoefficientService {
  getByUserId(userId: string): Promise<SettingPriceBodyPartCoefficientDto[]>;
  create(dto: SettingPriceBodyPartCoefficientDto): Promise<SettingPriceBodyPartCoefficientDto>;
  update(dto: SettingPriceBodyPartCoefficientDto): Promise<SettingPriceBodyPartCoefficientDto>;
  delete(id: string): Promise<void>;
}
