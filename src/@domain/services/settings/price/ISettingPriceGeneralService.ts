import { SettingPriceGeneralDto } from '@/@application/dtos/settings/price/SettingPriceGeneralDto';

export interface ISettingPriceGeneralService {
  getByUserId(userId: string): Promise<SettingPriceGeneralDto[]>;
  create(dto: SettingPriceGeneralDto): Promise<SettingPriceGeneralDto>;
  update(dto: SettingPriceGeneralDto): Promise<SettingPriceGeneralDto>;
  delete(id: string): Promise<void>;
}
