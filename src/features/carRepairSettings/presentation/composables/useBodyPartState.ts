
import { IBodyPartUseCase } from '@/features/carRepairSettings/application/useCases/BodyPartUseCase';
import { IBodyPartState } from '@/features/carRepairSettings/presentation/types/IBodyPartState';
import { BodyPartViewModel } from '@/features/carRepairSettings/presentation/models/BodyPartViewModel';
import { JsonHelper } from '@/shared/application/utils/jsonHelper';
import { slugify } from '@/shared/application/utils/slugify';
import { computed, ref } from 'vue';

export interface UseBodyPartStateDependencies {
  bodyPartUseCase: IBodyPartUseCase;
}

export function createUseBodyPartState(deps: UseBodyPartStateDependencies): IBodyPartState {
  const { bodyPartUseCase } = deps;
  const _bodyParts = ref<BodyPartViewModel[]>([]);
  const _selectedBodyPart = ref<BodyPartViewModel>({
    id: undefined,
    name: '',
    code: '',
    color: ''
  });
  const loading = ref<boolean>(false);
  const error = ref<unknown>(null);

  const init = async () => {
    return fetchBodyParts().then(() => {
      return;
    });
  };

  const fetchBodyParts = async (): Promise<BodyPartViewModel[]> => {
    loading.value = true;
    try {
      return bodyPartUseCase.executeGetAll().then((viewModels) => {
        _bodyParts.value = viewModels;
        return viewModels;
      });
    } catch (e) {
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const selectBodyPart = (bodyPart: BodyPartViewModel): void => {
    const exists = _bodyParts.value.find((bp) => bp.id === bodyPart.id);
    if (!exists) throw new Error('Body part does not exist');

    _selectedBodyPart.value = JsonHelper.clone(bodyPart);
  };

  const resetSelectedBodyPart = (): void => {    
    _selectedBodyPart.value = {
      id: undefined,
      name: '',
      code: '',
      color: ''
    };
  };

  const addBodyPart = async (bodyPart: BodyPartViewModel): Promise<BodyPartViewModel> => {    
    loading.value = true;
    try {
      bodyPart.code = slugify(bodyPart.name);
      return bodyPartUseCase.executeCreate(bodyPart).then((viewModel) => {
        _bodyParts.value.push(viewModel);
        resetSelectedBodyPart();
        return viewModel;
      });
    } catch (e) {
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const updateBodyPart = async (bodyPart: BodyPartViewModel): Promise<BodyPartViewModel> => {
    if (!bodyPart.id) throw new Error('Body part does not exist');

    const exist = _bodyParts.value.find((bp) => bp.id === bodyPart.id);
    if (!exist) throw new Error('Body part does not exist');

    loading.value = true;
    try {
      bodyPart.code = slugify(bodyPart.name);
      return bodyPartUseCase.executeUpdate(bodyPart).then((viewModel) => {
        _bodyParts.value = _bodyParts.value.map((bp) => (bp.id === bodyPart.id ? viewModel : bp));
        return viewModel;
      });
    } catch (e) {
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const deleteBodyPart = async (bodyPartId: string): Promise<void> => {
    if (!bodyPartId) throw new Error('Body part does not exist');

    const exist = _bodyParts.value.find((bp) => bp.id === bodyPartId);
    if (!exist) throw new Error('Body part does not exist');

    loading.value = true;
    try {
      return bodyPartUseCase.executeDelete(bodyPartId).then(() => {
        _bodyParts.value = _bodyParts.value.filter((bp) => bp.id !== bodyPartId);
      });
    } catch (e) {
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    bodyParts: computed(() => _bodyParts.value),
    selectedBodyPart: computed(() => _selectedBodyPart.value),
    loading,
    error,
    init,
    fetchBodyParts,
    selectBodyPart,
    addBodyPart,
    updateBodyPart,
    deleteBodyPart,
    resetSelectedBodyPart,
  };
}
