import { SettingPriceDiameterCoefficientViewModel } from '@/@presentation/types/models/settings/price/SettingPriceDiameterCoefficientViewModel';
import { ComputedRef, Ref } from 'vue';

export interface IUseSettingPriceDiameterCoefficientState {
  settings: ComputedRef<SettingPriceDiameterCoefficientViewModel[]>;
  selectedSetting: ComputedRef<SettingPriceDiameterCoefficientViewModel | null>;
  loading: Ref<boolean>;
  error: Ref<unknown>;

  init(): Promise<void>;
  fetchSettings(): Promise<SettingPriceDiameterCoefficientViewModel[]>;
  selectSetting(setting: SettingPriceDiameterCoefficientViewModel | null): void;
  addSetting(setting: SettingPriceDiameterCoefficientViewModel): Promise<SettingPriceDiameterCoefficientViewModel>;
  updateSetting(setting: SettingPriceDiameterCoefficientViewModel): Promise<SettingPriceDiameterCoefficientViewModel>;
  deleteSetting(id: string): Promise<void>;
}
