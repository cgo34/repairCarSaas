import { computed, ref } from 'vue';

import { IAuthState } from '@/@application/states/interfaces/IAuthState';

import { container } from '@/@infrastructure/ioc/inversify.config';

import { SYMBOLS } from '@/@infrastructure/ioc/symbols';

import { OrganizationProfileMapper } from '@/@presentation/mappers/organizations/OrganizationProfileMapper';

import { IUseOrganizationProfileState } from '@/@presentation/types/composables/IUseOrganizationProfile';

import { OrganizationProfileViewModel } from '@/@presentation/types/models/organizations/OrganizationProfileViewModel';
import { IOrganizationProfileUseCase } from '@/@domain/useCases/organizations/IOrganizationProfileUseCase';

export function useOrganizationProfileState():
  IUseOrganizationProfileState
{
  const authState =
    container.get<IAuthState>(
      SYMBOLS.States.AuthState
    );

  const useCase =
    container.get<IOrganizationProfileUseCase>(
      SYMBOLS.UseCases.OrganizationProfileUseCase
    );

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