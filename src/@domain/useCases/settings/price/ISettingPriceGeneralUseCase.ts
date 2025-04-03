import { SettingPriceGeneralViewDto } from "@/@application/dtos/settings/SettingPriceGeneralViewDto";

export interface ISettingPriceGeneralUseCase {
  getByUserId(userId: string): Promise<SettingPriceGeneralViewDto[]>;
  create(dto: SettingPriceGeneralViewDto): Promise<SettingPriceGeneralViewDto>;
  update(dto: SettingPriceGeneralViewDto): Promise<SettingPriceGeneralViewDto>;
  delete(id: string): Promise<void>;
}
