import { SettingPriceImpactCountToUtViewModel } from "@/@presentation/types/models/settings/price/SettingPriceImpactCountToUtViewModel";

export interface ISettingPriceImpactCountToUtUseCase {
  getAdmin(): Promise<SettingPriceImpactCountToUtViewModel[]>;
  getByUserId(userId: string): Promise<SettingPriceImpactCountToUtViewModel[]>;
  save(settings: SettingPriceImpactCountToUtViewModel[]): Promise<SettingPriceImpactCountToUtViewModel[]>;
  create(viewModel: SettingPriceImpactCountToUtViewModel): Promise<SettingPriceImpactCountToUtViewModel>;
  update(viewModel: SettingPriceImpactCountToUtViewModel): Promise<SettingPriceImpactCountToUtViewModel>;
  delete(id: string): Promise<void>;
}
