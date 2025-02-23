import { SettingPriceImpactCountToUtViewModel } from '@/@presentation/types/models/settings/price/SettingPriceImpactCountToUtViewModel';
import { ComputedRef, Ref } from 'vue';

export interface IUseSettingPriceImpactCountToUtState {
  settings: ComputedRef<SettingPriceImpactCountToUtViewModel[]>;
  selectedSetting: ComputedRef<SettingPriceImpactCountToUtViewModel | null>;
  loading: Ref<boolean>;
  error: Ref<unknown>;

  init(): Promise<void>;
  fetchSettings(): Promise<SettingPriceImpactCountToUtViewModel[]>;
  selectSetting(setting: SettingPriceImpactCountToUtViewModel | null): void;
  addSetting(setting: SettingPriceImpactCountToUtViewModel): Promise<SettingPriceImpactCountToUtViewModel>;
  updateSetting(setting: SettingPriceImpactCountToUtViewModel): Promise<SettingPriceImpactCountToUtViewModel>;
  deleteSetting(id: string): Promise<void>;
}
