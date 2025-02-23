import { SettingPriceBodyMaterialCoefficientViewModel } from '@/@presentation/types/models/settings/price/SettingPriceBodyMaterialCoefficientViewModel';
import { ComputedRef, Ref } from 'vue';

export interface IUseSettingPriceBodyMaterialCoefficientState {
  settings: ComputedRef<SettingPriceBodyMaterialCoefficientViewModel[]>;
  selectedSetting: ComputedRef<SettingPriceBodyMaterialCoefficientViewModel | null>;
  loading: Ref<boolean>;
  error: Ref<unknown>;

  init(): Promise<void>;
  fetchSettings(): Promise<SettingPriceBodyMaterialCoefficientViewModel[]>;
  selectSetting(setting: SettingPriceBodyMaterialCoefficientViewModel | null): void;
  addSetting(setting: SettingPriceBodyMaterialCoefficientViewModel): Promise<SettingPriceBodyMaterialCoefficientViewModel>;
  updateSetting(setting: SettingPriceBodyMaterialCoefficientViewModel): Promise<SettingPriceBodyMaterialCoefficientViewModel>;
  deleteSetting(id: string): Promise<void>;
}
