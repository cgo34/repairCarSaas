import { ComputedRef, Ref } from 'vue';

import { OrganizationProfileViewModel } from '@/@presentation/types/models/organizations/OrganizationProfileViewModel';

export interface IUseOrganizationProfileState {
  /**
   * ============================================================
   * STATE
   * ============================================================
   */

  profile:
    ComputedRef<OrganizationProfileViewModel>;

  loading: Ref<boolean>;

  error: Ref<unknown>;

  /**
   * ============================================================
   * ACTIONS
   * ============================================================
   */

  init(): Promise<void>;

  getProfile(): Promise<void>;

  updateProfile(): Promise<void>;

  resetProfile(): void;
}