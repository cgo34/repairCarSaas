import { IDentRepairTypeUseCase } from '@/features/carRepairSettings/application/useCases/DentRepairTypeUSeCase';
import { IDentRepairTypeState } from '@/features/carRepairSettings/presentation/types/IDentRepairTypeState';
import { DentRepairTypeViewModel } from '@/features/carRepairSettings/presentation/models/DentRepairTypeViewModel';
// mapping now handled in use case
import { JsonHelper } from '@/shared/application/utils/jsonHelper';
import { computed, ref } from 'vue';

export interface UseDentRepairTypeStateDependencies {
  dentRepairTypeUseCase: IDentRepairTypeUseCase;
}

export function createUseDentRepairTypeState(deps: UseDentRepairTypeStateDependencies): IDentRepairTypeState {
  const { dentRepairTypeUseCase } = deps;
  const _dentRepairTypes = ref<DentRepairTypeViewModel[]>([]);
  const _selectedDentRepairType = ref<DentRepairTypeViewModel>({
    id: undefined,
    name: '',
    code: '',
  });
  const loading = ref<boolean>(false);
  const error = ref<unknown>(null);

  const init = async () => {
    return fetchDentRepairTypes().then(() => {
      return
    })
  }

  const fetchDentRepairTypes = async (): Promise<DentRepairTypeViewModel[]> => {
    loading.value = true;
    try {
      return dentRepairTypeUseCase.executeGetAll().then((viewModels) => {
        _dentRepairTypes.value = viewModels;
        return viewModels;
      });
    } catch (e) {
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const selectDentRepairType = (dentRepairType: DentRepairTypeViewModel): void => {
    const exists = _dentRepairTypes.value.find((drt) => drt.id === dentRepairType.id);
    if (!exists)
      throw new Error('Dent repair type does not exist');
    
    _selectedDentRepairType.value = JsonHelper.clone(dentRepairType);
  }

  const resetSelectedDentRepairType = (): void => {
    _selectedDentRepairType.value = {
      id: undefined,
      name: '',
      code: '',
    };
  }

  const addDentRepairType = async (dentRepairType: DentRepairTypeViewModel): Promise<DentRepairTypeViewModel> => {
    loading.value = true;
    try {
      return dentRepairTypeUseCase.executeCreate(dentRepairType).then((viewModel) => {
        _dentRepairTypes.value.push(viewModel);
        resetSelectedDentRepairType();
        return viewModel;
      });
    } catch (e) {
      throw e;
    } finally {
      loading.value = false;
    }
  }

  const updateDentRepairType = async (dentRepairType: DentRepairTypeViewModel): Promise<DentRepairTypeViewModel> => {
    if (!dentRepairType.id)
      throw new Error('Dent repair type does not exist');

    const exist = _dentRepairTypes.value.find((drt) => drt.id === dentRepairType.id);
    if (!exist)
      throw new Error('Dent repair type does not exist');

    loading.value = true;
    try {
      return dentRepairTypeUseCase.executeUpdate(dentRepairType).then((viewModel) => {
        _dentRepairTypes.value = _dentRepairTypes.value.map((drt) => drt.id === dentRepairType.id ? viewModel : drt);
        return viewModel;
      });
    } catch (e) {
      throw e;
    } finally {
      loading.value = false;
    }
  }

  const deleteDentRepairType = async (dentRepairTypeUid: string): Promise<void> => {
    if (!dentRepairTypeUid)
      throw new Error('Dent repair type does not exist');

    const exist = _dentRepairTypes.value.find((drt) => drt.id === dentRepairTypeUid);
    if (!exist)
      throw new Error('Dent repair type does not exist');

    loading.value = true;
    try {
      return dentRepairTypeUseCase.executeDelete(dentRepairTypeUid).then(() => {
        _dentRepairTypes.value = _dentRepairTypes.value.filter((drt) => drt.id !== dentRepairTypeUid);
      });
    } catch (e) {
      // error.value = e;
      throw e;
    } finally {
      loading.value = false;
    }
  }

  return {
    dentRepairTypes: computed(() => _dentRepairTypes.value),
    selectedDentRepairType: computed(() => _selectedDentRepairType.value),
    loading,
    error,
    init,
    fetchDentRepairTypes,
    selectDentRepairType,
    addDentRepairType,
    updateDentRepairType,
    deleteDentRepairType,
    resetSelectedDentRepairType
  };
}