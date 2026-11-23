import { SettingPriceBodyPartCoefficientDto } from '@/features/priceSettings/application/dtos/SettingPriceBodyPartCoefficientDto';

export interface ISettingPriceBodyPartCoefficientRepository {
  getDefault(): Promise<SettingPriceBodyPartCoefficientDto[]>;
  getByOrganizationId(userId: string): Promise<SettingPriceBodyPartCoefficientDto[]>;
  save(setting: SettingPriceBodyPartCoefficientDto[]): Promise<SettingPriceBodyPartCoefficientDto[]>;
  create(setting: SettingPriceBodyPartCoefficientDto): Promise<SettingPriceBodyPartCoefficientDto>;
  update(setting: SettingPriceBodyPartCoefficientDto): Promise<SettingPriceBodyPartCoefficientDto>;
  delete(id: string): Promise<void>;
}
