import { BodyMaterialViewModel } from '@/@presentation/types/models/carRepair/BodyMaterialViewModel';
import { SettingPriceBodyMaterialCoefficientViewModel } from '@/@presentation/types/models/settings/price/SettingPriceBodyMaterialCoefficientViewModel';
import { ComputedRef, Ref } from 'vue';

export interface IUseSettingPriceBodyMaterialCoefficientState {
  settings: ComputedRef<SettingPriceBodyMaterialCoefficientViewModel[]>;
  selectedSetting: ComputedRef<SettingPriceBodyMaterialCoefficientViewModel>;
  loading: Ref<boolean>;
  error: Ref<unknown>;

  init(): Promise<void>;
  fetchSettings(): Promise<SettingPriceBodyMaterialCoefficientViewModel[]>;
  selectSetting(setting: SettingPriceBodyMaterialCoefficientViewModel): void;
  addSetting(setting: SettingPriceBodyMaterialCoefficientViewModel): Promise<SettingPriceBodyMaterialCoefficientViewModel>;
  updateSetting(setting: SettingPriceBodyMaterialCoefficientViewModel): Promise<SettingPriceBodyMaterialCoefficientViewModel>;
  deleteSetting(id: string): Promise<void>;
  resetSelectedSetting(): void;
  bodyMaterials: ComputedRef<BodyMaterialViewModel[]>;
}
