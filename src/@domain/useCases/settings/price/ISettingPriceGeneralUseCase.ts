import { SettingPriceGeneralViewModel } from "@/@presentation/types/models/settings/price/SettingPriceGeneralViewModel";

export interface ISettingPriceGeneralUseCase {
  getAdmin(): Promise<SettingPriceGeneralViewModel>;
  getByUserId(userId: string): Promise<SettingPriceGeneralViewModel>;
  save(viewModel: SettingPriceGeneralViewModel): Promise<SettingPriceGeneralViewModel>;
  create(viewModel: SettingPriceGeneralViewModel): Promise<SettingPriceGeneralViewModel>;
  update(viewModel: SettingPriceGeneralViewModel): Promise<SettingPriceGeneralViewModel>;
  delete(id: string): Promise<void>;
}
