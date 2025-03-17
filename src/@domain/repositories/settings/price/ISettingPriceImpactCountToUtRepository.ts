import { SettingPriceImpactCountToUtDto } from '@/@infrastructure/dtos/settings/price/SettingPriceImpactCountToUtDto';

export interface ISettingPriceImpactCountToUtRepository {
  getByUserId(userId: string): Promise<SettingPriceImpactCountToUtDto[]>;
  create(setting: SettingPriceImpactCountToUtDto): Promise<SettingPriceImpactCountToUtDto>;
  update(setting: SettingPriceImpactCountToUtDto): Promise<SettingPriceImpactCountToUtDto>;
  delete(id: string): Promise<void>;
}
