import { SettingPriceImpactCountToUtDto } from "@/@application/dtos/settings/price/SettingPriceImpactCountToUtDto";

export interface ISettingPriceImpactCountToUtUseCase {
  getAdmin(): Promise<SettingPriceImpactCountToUtDto[]>;
  getByUserId(userId: string): Promise<SettingPriceImpactCountToUtDto[]>;
  save(settings: SettingPriceImpactCountToUtDto[]): Promise<SettingPriceImpactCountToUtDto[]>;
  create(dto: SettingPriceImpactCountToUtDto): Promise<SettingPriceImpactCountToUtDto>;
  update(dto: SettingPriceImpactCountToUtDto): Promise<SettingPriceImpactCountToUtDto>;
  delete(id: string): Promise<void>;
}
