import { SettingPriceTechnicityCoefficientViewModel } from '@/features/priceSettings/presentation/models/SettingPriceTechnicityCoefficientViewModel';
import { ComputedRef, Ref } from 'vue';

export interface IUseSettingPriceTechnicityCoefficientState {
  settings: ComputedRef<SettingPriceTechnicityCoefficientViewModel>;
  loading: Ref<boolean>;
  error: Ref<unknown>;

  init(): Promise<void>;
  saveSettingTechnicityCoefficient(): Promise<void>;
}
