import { BodyMaterialViewModel } from '@/features/carRepairSettings/presentation/models/BodyMaterialViewModel';
import { SettingPriceBodyMaterialCoefficientViewModel } from '@/features/priceSettings/presentation/models/SettingPriceBodyMaterialCoefficientViewModel';
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
