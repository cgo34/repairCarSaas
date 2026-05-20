import { ComputedRef, Ref } from 'vue';

import { SettingPriceDiameterCoefficientViewModel } from '@/@presentation/types/models/settings/price/SettingPriceDiameterCoefficientViewModel';

export interface IUseSettingPriceDiameterCoefficientState {
  /**
   * ============================================================
   * STATE
   * ============================================================
   */

  settings:
    ComputedRef<
      SettingPriceDiameterCoefficientViewModel[]
    >;

  selectedSetting:
    ComputedRef<
      SettingPriceDiameterCoefficientViewModel | null
    >;

  loading: Ref<boolean>;

  error: Ref<unknown>;

  /**
   * ============================================================
   * ACTIONS
   * ============================================================
   */

  init(): Promise<void>;

  fetchSettings():
    Promise<
      SettingPriceDiameterCoefficientViewModel[]
    >;

  selectSetting(
    setting:
      SettingPriceDiameterCoefficientViewModel
  ): void;

  createSetting(
    setting:
      SettingPriceDiameterCoefficientViewModel
  ): Promise<void>;

  updateSetting(
    setting:
      SettingPriceDiameterCoefficientViewModel
  ): Promise<void>;

  saveSetting(
    setting:
      SettingPriceDiameterCoefficientViewModel
  ): Promise<void>;

  deleteSetting(id: string): Promise<void>;

  resetSelectedSetting(): void;
}