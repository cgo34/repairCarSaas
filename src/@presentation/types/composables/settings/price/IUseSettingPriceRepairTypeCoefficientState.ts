import { DentRepairTypeViewModel } from '@/@presentation/types/models/carRepair/DentRepairTypeViewModel';
import { SettingPriceRepairTypeCoefficientViewModel } from '@/@presentation/types/models/settings/price/SettingPriceRepairTypeCoefficientViewModel';
import { ComputedRef, Ref } from 'vue';

export interface IUseSettingPriceRepairTypeCoefficientState {
  settings: ComputedRef<SettingPriceRepairTypeCoefficientViewModel[]>;
  selectedSetting: ComputedRef<SettingPriceRepairTypeCoefficientViewModel>;
  loading: Ref<boolean>;
  error: Ref<unknown>;

  init(): Promise<void>;
  fetchSettings(): Promise<SettingPriceRepairTypeCoefficientViewModel[]>;
  selectSetting(setting: SettingPriceRepairTypeCoefficientViewModel): void;
  addSetting(setting: SettingPriceRepairTypeCoefficientViewModel): Promise<SettingPriceRepairTypeCoefficientViewModel>;
  updateSetting(setting: SettingPriceRepairTypeCoefficientViewModel): Promise<SettingPriceRepairTypeCoefficientViewModel>;
  deleteSetting(id: string): Promise<void>;
  resetSelectedSetting(): void;
  repairTypes: ComputedRef<DentRepairTypeViewModel[]>;
}
