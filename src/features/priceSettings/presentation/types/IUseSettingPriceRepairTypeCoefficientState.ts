import { DentRepairTypeViewModel } from '@/features/carRepairSettings/presentation/models/DentRepairTypeViewModel';
import { SettingPriceRepairTypeCoefficientViewModel } from '@/features/priceSettings/presentation/models/SettingPriceRepairTypeCoefficientViewModel';
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
