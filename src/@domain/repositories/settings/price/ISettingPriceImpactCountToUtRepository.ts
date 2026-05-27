import { SettingPriceImpactCountToUtDto } from '@/@application/dtos/settings/price/SettingPriceImpactCountToUtDto';

export interface ISettingPriceImpactCountToUtRepository {
  getDefault(): Promise<SettingPriceImpactCountToUtDto[]>;
  getByOrganizationId(userId: string): Promise<SettingPriceImpactCountToUtDto[]>;
  save(settings: SettingPriceImpactCountToUtDto[]): Promise<SettingPriceImpactCountToUtDto[]>;
  create(setting: SettingPriceImpactCountToUtDto): Promise<SettingPriceImpactCountToUtDto>;
  update(setting: SettingPriceImpactCountToUtDto): Promise<SettingPriceImpactCountToUtDto>;
  delete(id: string): Promise<void>;
}
