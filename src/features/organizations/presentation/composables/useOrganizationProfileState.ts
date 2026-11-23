import { computed, ref } from 'vue';

import { IAuthState } from '@/features/auth/presentation/state/IAuthState';



import { OrganizationProfileMapper } from '@/features/organizations/presentation/mappers/OrganizationProfileMapper';

import { IUseOrganizationProfileState } from '@/features/organizations/presentation/types/IUseOrganizationProfile';

import { OrganizationProfileViewModel } from '@/features/organizations/presentation/models/OrganizationProfileViewModel';
import { IOrganizationProfileUseCase } from '@/features/organizations/application/useCases/OrganizationProfileUseCase';

export interface UseOrganizationProfileStateDependencies {
  authState: IAuthState;
  useCase: IOrganizationProfileUseCase;
}

export function createUseOrganizationProfileState(deps: UseOrganizationProfileStateDependencies):
  IUseOrganizationProfileState
{
  const { authState, useCase } = deps;


  /**
   * ============================================================
   * STATE
   * ============================================================
   */

  const _profile =
    ref<OrganizationProfileViewModel>({
      organization_id: '',

      company_name: '',

      legal_form: '',

      siren: '',

      siret: '',

      tva_number: '',

      capital: '',

      address: '',

      zip_code: '',

      city: '',

      country: 'France',

      phone: '',

      email: '',

      website: '',

      iban: '',

      bic: '',

      payment_delay: 30,

      late_payment_penalty:
        '3 fois le taux légal',

      recovery_fee: '40 €',
    });

  const loading = ref(false);

  const error = ref<unknown>(null);

  /**
   * ============================================================
   * INIT
   * ============================================================
   */

  const init = async (): Promise<void> => {
    await getProfile();
  };

  /**
   * ============================================================
   * GET PROFILE
   * ============================================================
   */

  const getProfile =
    async (): Promise<void> => {
      loading.value = true;

      try {
        const organizationId =
          authState.userContext.value
            ?.organization.id ?? '';

        const dto =
          await useCase.getProfile(
            organizationId
          );

        if (!dto) return;

        _profile.value =
          OrganizationProfileMapper.dtoToView(
            dto
          );
      } catch (e) {
        error.value = e;

        throw e;
      } finally {
        loading.value = false;
      }
    };

  /**
   * ============================================================
   * UPDATE PROFILE
   * ============================================================
   */

  const updateProfile =
  async (): Promise<void> => {
    loading.value = true;

    try {
      const organizationId =
        authState.userContext.value
          ?.organization.id;

      if (!organizationId) {
        throw new Error(
          'Organization id is required'
        );
      }

      _profile.value.organization_id =
        organizationId;

      const dto =
        OrganizationProfileMapper.viewToDto(
          _profile.value
        );

      const updated =
        await useCase.updateProfile(dto);

      _profile.value =
        OrganizationProfileMapper.dtoToView(
          updated
        );
    } catch (e) {
      error.value = e;

      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * ============================================================
   * RESET
   * ============================================================
   */

  const resetProfile = (): void => {
    _profile.value = {
      organization_id: '',

      company_name: '',

      legal_form: '',

      siren: '',

      siret: '',

      tva_number: '',

      capital: '',

      address: '',

      zip_code: '',

      city: '',

      country: 'France',

      phone: '',

      email: '',

      website: '',

      iban: '',

      bic: '',

      payment_delay: 30,

      late_payment_penalty:
        '3 fois le taux légal',

      recovery_fee: '40 €',
    };
  };

  /**
   * ============================================================
   * EXPOSE
   * ============================================================
   */

  return {
    profile: computed(() => _profile.value),

    loading,

    error,

    init,

    getProfile,

    updateProfile,

    resetProfile,
  };
}