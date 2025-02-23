import { SettingPriceGeneralDto } from '@/@application/dtos/settings/price/SettingPriceGeneralDto';

export interface ISettingPriceGeneralUseCase {
  getByUserId(userId: string): Promise<SettingPriceGeneralDto[]>;
  create(dto: SettingPriceGeneralDto): Promise<SettingPriceGeneralDto>;
  update(dto: SettingPriceGeneralDto): Promise<SettingPriceGeneralDto>;
  delete(id: string): Promise<void>;
}
