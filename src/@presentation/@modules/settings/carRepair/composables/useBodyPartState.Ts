
import { IBodyPartUseCase } from '@/@domain/useCases/carRepair/IBodyPartUseCase';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { IBodyPartState } from '@/@presentation/types/composables/IBodyPartState';
import { BodyPartViewModel } from '@/@presentation/types/models/carRepair/BodyPartViewModel';
import { JsonHelper } from '@/helpers/jsonHelper';
import { slugify } from '@/shared/utils/slugify';
import { computed, ref } from 'vue';

export function useBodyPartState(): IBodyPartState {
  const bodyPartUseCase = container.get<IBodyPartUseCase>(SYMBOLS.UseCases.CarRepair.BodyPartUseCase);
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
      return bodyPartUseCase.executeGetAll().then((data) => {
        _bodyParts.value = data;
        return data;
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
      return bodyPartUseCase.executeCreate(bodyPart).then((data) => {
        _bodyParts.value.push(data);
        resetSelectedBodyPart();
        return data;
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
      return bodyPartUseCase.executeUpdate(bodyPart).then((data) => {
        _bodyParts.value = _bodyParts.value.map((bp) => (bp.id === bodyPart.id ? data : bp));
        return data;
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
