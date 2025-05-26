import { SettingPriceTechnicityCoefficientViewModel } from '@/@presentation/types/models/settings/price/SettingPriceTechnicityCoefficientViewModel';
import { ComputedRef, Ref } from 'vue';

export interface IUseSettingPriceTechnicityCoefficientState {
  settings: ComputedRef<SettingPriceTechnicityCoefficientViewModel[]>;
  selectedSetting: ComputedRef<SettingPriceTechnicityCoefficientViewModel | null>;
  loading: Ref<boolean>;
  error: Ref<unknown>;

  init(): Promise<void>;
  fetchSettings(): Promise<SettingPriceTechnicityCoefficientViewModel[]>;
  selectSetting(setting: SettingPriceTechnicityCoefficientViewModel): void;
  addSetting(setting: SettingPriceTechnicityCoefficientViewModel): Promise<SettingPriceTechnicityCoefficientViewModel>;
  updateSetting(setting: SettingPriceTechnicityCoefficientViewModel): Promise<SettingPriceTechnicityCoefficientViewModel>;
  deleteSetting(id: string): Promise<void>;
  resetSelectedSetting(): void;
}
