import { SettingPriceGeneralDto } from "@/@application/dtos/settings/price/SettingPriceGeneralDto";

export interface ISettingPriceGeneralUseCase {
  getAdmin(): Promise<SettingPriceGeneralDto>;
  getByUserId(userId: string): Promise<SettingPriceGeneralDto>;
  save(dto: SettingPriceGeneralDto): Promise<SettingPriceGeneralDto>;
  create(dto: SettingPriceGeneralDto): Promise<SettingPriceGeneralDto>;
  update(dto: SettingPriceGeneralDto): Promise<SettingPriceGeneralDto>;
  delete(id: string): Promise<void>;
}
