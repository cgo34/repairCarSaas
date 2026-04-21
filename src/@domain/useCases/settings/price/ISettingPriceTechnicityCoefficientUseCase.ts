import { SettingPriceTechnicityCoefficientViewModel } from "@/@presentation/types/models/settings/price/SettingPriceTechnicityCoefficientViewModel";


export interface ISettingPriceTechnicityCoefficientUseCase {
  getAdmin(): Promise<SettingPriceTechnicityCoefficientViewModel>;
  getByUserId(userId: string): Promise<SettingPriceTechnicityCoefficientViewModel>;
  save(viewModel: SettingPriceTechnicityCoefficientViewModel): Promise<SettingPriceTechnicityCoefficientViewModel>;
  create(viewModel: SettingPriceTechnicityCoefficientViewModel): Promise<SettingPriceTechnicityCoefficientViewModel>;
  update(viewModel: SettingPriceTechnicityCoefficientViewModel): Promise<SettingPriceTechnicityCoefficientViewModel>;
  delete(id: string): Promise<void>;
}
