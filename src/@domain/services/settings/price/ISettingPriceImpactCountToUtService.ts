import { SettingPriceImpactCountToUtDto } from '@/@infrastructure/dtos/settings/price/SettingPriceImpactCountToUtDto';

export interface ISettingPriceImpactCountToUtService {
  getByUserId(userId: string): Promise<SettingPriceImpactCountToUtDto[]>;
  create(dto: SettingPriceImpactCountToUtDto): Promise<SettingPriceImpactCountToUtDto>;
  update(dto: SettingPriceImpactCountToUtDto): Promise<SettingPriceImpactCountToUtDto>;
  delete(id: string): Promise<void>;
}
