import { computed, ref } from 'vue';

import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { IGarageUseCase } from '@/@domain/useCases/IGarageUseCase';
import { ITechnicianGarageAccessRepository } from '@/@domain/repositories/ITechnicianGarageAccessRepository';

import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';

import { GarageMapper } from '@/@presentation/mappers/GarageMapper';

import { GarageFormFactory } from '@/@presentation/factories/GarageFormFactory';

import { IUseGarageState } from '@/@presentation/types/composables/IUseGarageState';

import { GarageForm } from '@/@presentation/types/forms/GarageForm';

import { GarageViewModel } from '@/@presentation/types/models/GarageViewModel';

export function useGarageState(): IUseGarageState {
  const authState = container.get<IAuthState>(
    SYMBOLS.States.AuthState
  );

  const garageUseCase = container.get<IGarageUseCase>(
    SYMBOLS.UseCases.Garage
  );

  const garageAccessRepo = container.get<ITechnicianGarageAccessRepository>(
    SYMBOLS.Repositories.TechnicianGarageAccessRepository
  );

  /**
   * ============================================================
   * STATE
   * ============================================================
   */

  const _garages = ref<GarageViewModel[]>([]);

  const _selectedGarageForm = ref<GarageForm>(
    GarageFormFactory.createEmpty()
  );

  const loading = ref<boolean>(false);

  const error = ref<unknown>(null);

  /**
   * ============================================================
   * INIT
   * ============================================================
   */

  const init = async (): Promise<void> => {
    await fetchGarages();
  };

  /**
   * ============================================================
   * FETCH GARAGES
   * ============================================================
   */

  const fetchGarages = async (): Promise<
    GarageViewModel[]
  > => {
    loading.value = true;

    try {
      const organizationId =
        authState.userContext.value?.organization.id;

      if (!organizationId) {
        throw new Error('Organization id is required');
      }

      const isTechnician = authState.userContext.value?.membership.role === 'technician';
      const userId = authState.userContext.value?.id ?? '';

      const data = isTechnician
        ? await garageAccessRepo.getGaragesByTechnicianId(userId)
        : await garageUseCase.getGaragesByOrganizationId(organizationId);

      const garages =
        data.map(GarageMapper.dtoToView);

      _garages.value = garages;

      return garages;
    } catch (e) {
      error.value = e;

      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * ============================================================
   * SELECT GARAGE
   * ============================================================
   */

  const selectGarage = (
    garage: GarageViewModel
  ): void => {
    _selectedGarageForm.value =
      GarageFormFactory.createFromGarage(
        garage
      );
  };

  /**
   * ============================================================
   * RESET FORM
   * ============================================================
   */

  const resetSelectedGarageForm =
    (): void => {
      _selectedGarageForm.value =
        GarageFormFactory.createEmpty();
    };

  /**
   * ============================================================
   * ADD GARAGE
   * ============================================================
   */

  const addGarage = async (
    form: GarageForm
  ): Promise<void> => {
    loading.value = true;

    try {
      const organizationId = authState.userContext.value?.organization.id ?? '';

      const garageToCreate = GarageMapper.viewToDto(form);
      garageToCreate.organization_id = organizationId;

      const createdGarage = await garageUseCase.create(garageToCreate);

      const garageViewModel = GarageMapper.dtoToView(createdGarage);

      _garages.value.push(garageViewModel);

      resetSelectedGarageForm();
    } catch (e) {
      error.value = e;

      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * ============================================================
   * UPDATE GARAGE
   * ============================================================
   */

  const updateGarage = async (
    form: GarageForm
  ): Promise<void> => {
    loading.value = true;

    try {
      if (!form.id) {
        throw new Error('Garage id is required');
      }

      const updatedGarage =
        await garageUseCase.update({
          id: form.id,

          organization_id:
            form.organization_id,

          name: form.name,
          code: form.code,

          address: form.address,
          zip_code: form.zip_code,
          city: form.city,

          phone: form.phone,
          email: form.email,

          percentageCommission: form.percentageCommission,
        });

      const garageViewModel =
        GarageMapper.dtoToView(
          updatedGarage
        );

      _garages.value =
        _garages.value.map(garage =>
          garage.id === form.id
            ? garageViewModel
            : garage
        );

      resetSelectedGarageForm();
    } catch (e) {
      error.value = e;

      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * ============================================================
   * DELETE GARAGE
   * ============================================================
   */

  const archiveGarage = async (
    id: string
  ): Promise<void> => {
    loading.value = true;

    try {
      const archivedGarage = await garageUseCase.archive(id);

      _garages.value = _garages.value.map(
        garage =>
          garage.id === id
            ? archivedGarage
            : garage
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
   * EXPOSE
   * ============================================================
   */

  return {
    garages: computed(
      () => _garages.value
    ),

    selectedGarageForm: computed(
      () => _selectedGarageForm.value
    ),

    loading,

    error,

    init,

    fetchGarages,

    selectGarage,

    addGarage,

    updateGarage,

    archiveGarage,

    resetSelectedGarageForm,
  };
}