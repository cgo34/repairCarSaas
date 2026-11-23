import { SettingPriceGeneralViewModel } from '@/features/priceSettings/presentation/models/SettingPriceGeneralViewModel';
import { ComputedRef, Ref } from 'vue';

export interface IUseSettingPriceGeneralState {
  settings: ComputedRef<SettingPriceGeneralViewModel>;
  loading: Ref<boolean>;
  error: Ref<unknown>;

  init(): Promise<void>;
  saveSettingPriceGeneral(): Promise<void>;
}
