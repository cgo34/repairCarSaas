import { BodyPart } from '@/@domain/entities/carRepair/BodyPart';
import { IBodyPartState } from '@/@domain/states/carRepair/IBodyPartState';
import { IBodyPartUseCase } from '@domain/useCases/carRepair/IBodyPartUseCase';
import { computed, ref } from 'vue';

export function useBodyPartState(bodyPartUseCase: IBodyPartUseCase): IBodyPartState {
  const _bodyParts = ref<BodyPart[]>([]);
  const _selectedBodyPart = ref<BodyPart>({
    id: undefined,
    name: '',
    code: '',
    color: '',
  });
  const loading = ref<boolean>(false);
  const error = ref<unknown>(null);

  const init = async () => {
    return fetchBodyParts().then(() => {
      return
    })
  }

  const fetchBodyParts = async (): Promise<BodyPart[]> => {
    loading.value = true;
    try {
      return bodyPartUseCase.executeGetAll().then((data) => {
        _bodyParts.value = data;
        return data;
      });
    } catch (e) {
      // error.value = e;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const selectBodyPart = (bodyPart: BodyPart | null): void => {    
    if (!bodyPart)
      return resetSelectedBodyPart();

    const exists = _bodyParts.value.find((bp) => bp.id === bodyPart.id);
    if (!exists)
      throw new Error('Body part does not exist');

    console.log('useBodyPart.selectBodyPart', bodyPart);

    _selectedBodyPart.value = bodyPart;
  }

  const resetSelectedBodyPart = (): void => {
    _selectedBodyPart.value = {
      id: undefined,
      name: '',
      code: '',
      color: '',
    };
  }

  const addBodyPart = async (bodyPart: BodyPart): Promise<BodyPart> => {
    loading.value = true;
    try {
      return bodyPartUseCase.executeCreate(bodyPart).then((data) => {
        _bodyParts.value.push(data);
        resetSelectedBodyPart();
        return data;
      });
    } catch (e) {
      // error.value = e;
      throw e;
    } finally {
      loading.value = false;
    }
  }

  const updateBodyPart = async (bodyPart: BodyPart): Promise<BodyPart> => {
    if (!bodyPart.id)
      throw new Error('Body part does not exist');

    const exist = _bodyParts.value.find((bp) => bp.id === bodyPart.id);
    if (!exist)
      throw new Error('Body part does not exist');

    loading.value = true;
    try {
      return bodyPartUseCase.executeUpdate(bodyPart).then((data) => {
        _bodyParts.value = _bodyParts.value.map((bp) => bp.id === bodyPart.id ? data : bp);
        return data;
      });
    } catch (e) {
      // error.value = e;
      throw e;
    } finally {
      loading.value = false;
    }
  }

  const deleteBodyPart = async (bodyPartUid: string): Promise<void> => {
    if (!bodyPartUid)
      throw new Error('Body part does not exist');

    const exist = _bodyParts.value.find((bp) => bp.id === bodyPartUid);
    if (!exist)
      throw new Error('Body part does not exist');

    loading.value = true;
    try {
      return bodyPartUseCase.executeDelete(bodyPartUid).then(() => {
        _bodyParts.value = _bodyParts.value.filter((bp) => bp.id !== bodyPartUid);
      });
    } catch (e) {
      // error.value = e;
      throw e;
    } finally {
      loading.value = false;
    }
  }

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
  };
}