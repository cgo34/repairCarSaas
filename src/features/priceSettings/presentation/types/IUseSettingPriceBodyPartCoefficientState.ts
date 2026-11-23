import { SettingPriceBodyPartCoefficientViewModel } from '@/features/priceSettings/presentation/models/SettingPriceBodyPartCoefficientViewModel';
import { ComputedRef, Ref } from 'vue';

export interface IUseSettingPriceBodyPartCoefficientState {
  settings: ComputedRef<SettingPriceBodyPartCoefficientViewModel[]>;
  loading: Ref<boolean>;
  error: Ref<unknown>;

  init(): Promise<void>;
  saveSettingBodyPartCoefficient(): Promise<void>;
}
