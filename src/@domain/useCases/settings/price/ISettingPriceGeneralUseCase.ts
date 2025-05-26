import { SettingPriceGeneralViewDto } from "@/@application/dtos/settings/SettingPriceGeneralViewDto";
import { SettingPriceGeneralDto } from "@/@infrastructure/dtos/settings/price/SettingPriceGeneralDto";

export interface ISettingPriceGeneralUseCase {
  getAdmin(): Promise<SettingPriceGeneralDto>;
  getByUserId(userId: string): Promise<SettingPriceGeneralDto>;
  save(dto: SettingPriceGeneralDto): Promise<SettingPriceGeneralDto>;
  create(dto: SettingPriceGeneralViewDto): Promise<SettingPriceGeneralDto>;
  update(dto: SettingPriceGeneralViewDto): Promise<SettingPriceGeneralDto>;
  delete(id: string): Promise<void>;
}
