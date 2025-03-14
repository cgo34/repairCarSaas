import { BodyPartViewModel } from '@/@presentation/types/models/carRepair/BodyPartViewModel';
import { SettingPriceBodyPartCoefficientViewModel } from '@/@presentation/types/models/settings/price/SettingPriceBodyPartCoefficientViewModel';
import { ComputedRef, Ref } from 'vue';

export interface IUseSettingPriceBodyPartCoefficientState {
  settings: ComputedRef<SettingPriceBodyPartCoefficientViewModel[]>;
  selectedSetting: ComputedRef<SettingPriceBodyPartCoefficientViewModel>;
  loading: Ref<boolean>;
  error: Ref<unknown>;

  init(): Promise<void>;
  fetchSettings(): Promise<SettingPriceBodyPartCoefficientViewModel[]>;
  selectSetting(setting: SettingPriceBodyPartCoefficientViewModel): void;
  addSetting(setting: SettingPriceBodyPartCoefficientViewModel): Promise<SettingPriceBodyPartCoefficientViewModel>;
  updateSetting(setting: SettingPriceBodyPartCoefficientViewModel): Promise<SettingPriceBodyPartCoefficientViewModel>;
  deleteSetting(id: string): Promise<void>;
  resetSelectedSetting(): void;
  bodyParts: ComputedRef<BodyPartViewModel[]>;
}
