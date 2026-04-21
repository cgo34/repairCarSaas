import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { IGarageUseCase } from '@/@domain/useCases/IGarageUseCase';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { GarageMapper } from '@/@presentation/mappers/GarageMapper';
import { IUseGarageState } from '@/@presentation/types/composables/IUseGarageState';
import { GarageViewModel } from '@/@presentation/types/models/GarageViewModel';
import { JsonHelper } from '@/helpers/jsonHelper';
import { computed, ref } from 'vue';

export function useGarageState(): IUseGarageState {
  const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);
  const garageUseCase = container.get<IGarageUseCase>(SYMBOLS.UseCases.Garage);
  
  const _garages = ref<GarageViewModel[]>([]);
  const _selectedGarage = ref<GarageViewModel>({
    userId: '',
    name: '',
    code: '',
    address: '',
    zipCode: '',
    city: '',
    phone: '',
    email: '',
    percentageCommission: 0,
  });
  const loading = ref<boolean>(false);
  const error = ref<unknown>(null);

  const init = async () => {
    return fetchGarages().then(() => {
      return;
    });
  };

  const fetchGarages = async (): Promise<GarageViewModel[]> => {
    loading.value = true;
    try {
      if (!authState.user?.value?.id) throw new Error('User does not exist');

      return garageUseCase.getByUserId(authState.user?.value?.id).then((data) => {
        const viewModels = data.map((g) => GarageMapper.dtoToView(g));
        _garages.value = viewModels;
        return viewModels;
      });
    } catch (e) {
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const selectGarage = (garage: GarageViewModel): void => {
    _selectedGarage.value = JsonHelper.clone(garage);
  };

  const resetSelectedGarage = (): void => {
    _selectedGarage.value = {
      userId: '',
      name: '',
      code: '',
      address: '',
      zipCode: '',
      city: '',
      phone: '',
      email: '',
      percentageCommission: 0,
    };
  };

  const addGarage = async (garage: GarageViewModel) => {
    loading.value = true;
    try {
      garage.userId = authState.user?.value?.id ?? '';
      return garageUseCase.create(GarageMapper.viewToDto(garage)).then((data) => {
        const dataViewModel = GarageMapper.dtoToView(data);
        _garages.value.push(dataViewModel);
        resetSelectedGarage();
        return dataViewModel;
      });
    } finally {
      loading.value = false;
    }
  };

  const updateGarage = async (garage: GarageViewModel) => {
    loading.value = true;
    try {
      return garageUseCase.update(GarageMapper.viewToDto(garage)).then((data) => {
        const dataViewModel = GarageMapper.dtoToView(data);
        _garages.value = _garages.value.map((g) => (g.id === garage.id ? dataViewModel : g));
        return dataViewModel;
      });
    } finally {
      loading.value = false;
    }
  };

  const deleteGarage = async (id: string) => {
    loading.value = true;
    try {
      return garageUseCase.delete(id).then(() => {
        _garages.value = _garages.value.filter((g) => g.id !== id);
      });
    } finally {
      loading.value = false;
    }
  };

  return {
    garages: computed(() => _garages.value),
    selectedGarage: computed(() => _selectedGarage.value),
    loading,
    error,
    init,
    fetchGarages,
    selectGarage,
    addGarage,
    updateGarage,
    deleteGarage,
    resetSelectedGarage,
  };
}
