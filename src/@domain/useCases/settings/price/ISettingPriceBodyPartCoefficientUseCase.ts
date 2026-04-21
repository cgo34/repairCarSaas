import { SettingPriceBodyPartCoefficientViewModel } from "@/@presentation/types/models/settings/price/SettingPriceBodyPartCoefficientViewModel";
import { SettingPriceBodyPartCoefficientDto } from "@/@application/dtos/settings/price/SettingPriceBodyPartCoefficientDto";

export interface ISettingPriceBodyPartCoefficientUseCase {
  getAdmin(): Promise<SettingPriceBodyPartCoefficientViewModel[]>;
  getByUserId(userId: string): Promise<SettingPriceBodyPartCoefficientViewModel[]>;
  save(viewModels: SettingPriceBodyPartCoefficientViewModel[]): Promise<SettingPriceBodyPartCoefficientViewModel[]>;
  create(viewModel: SettingPriceBodyPartCoefficientViewModel): Promise<SettingPriceBodyPartCoefficientViewModel>;
  update(viewModel: SettingPriceBodyPartCoefficientViewModel): Promise<SettingPriceBodyPartCoefficientViewModel>;
  delete(id: string): Promise<void>;
}
