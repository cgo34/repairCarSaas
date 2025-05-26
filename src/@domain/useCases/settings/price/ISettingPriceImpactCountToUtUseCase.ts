import { SettingPriceImpactCountToUtViewDto } from "@/@application/dtos/settings/SettingPriceImpactCountToUtViewDto";

export interface ISettingPriceImpactCountToUtUseCase {
  getByUserId(userId: string): Promise<SettingPriceImpactCountToUtViewDto[]>;
  save(dto: SettingPriceImpactCountToUtViewDto): Promise<SettingPriceImpactCountToUtViewDto>;
  create(dto: SettingPriceImpactCountToUtViewDto): Promise<SettingPriceImpactCountToUtViewDto>;
  update(dto: SettingPriceImpactCountToUtViewDto): Promise<SettingPriceImpactCountToUtViewDto>;
  delete(id: string): Promise<void>;
}
