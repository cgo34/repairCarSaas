import { SettingPriceGeneralViewModel } from '@/@presentation/types/models/settings/price/SettingPriceGeneralViewModel';
import { ComputedRef, Ref } from 'vue';

export interface IUseSettingPriceGeneralState {
  settings: ComputedRef<SettingPriceGeneralViewModel[]>;
  selectedSetting: ComputedRef<SettingPriceGeneralViewModel>;
  loading: Ref<boolean>;
  error: Ref<unknown>;

  init(): Promise<void>;
  fetchSettings(): Promise<SettingPriceGeneralViewModel[]>;
  selectSetting(setting: SettingPriceGeneralViewModel): void;
  addSetting(setting: SettingPriceGeneralViewModel): Promise<SettingPriceGeneralViewModel>;
  updateSetting(setting: SettingPriceGeneralViewModel): Promise<SettingPriceGeneralViewModel>;
  deleteSetting(id: string): Promise<void>;
  resetSelectedSetting(): void;
}
