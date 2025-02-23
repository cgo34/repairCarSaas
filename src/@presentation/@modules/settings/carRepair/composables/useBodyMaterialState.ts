import { IBodyMaterialState } from '@/@application/states/interfaces/carRepair/IBodyMaterialState';
import { IBodyMaterialUseCase } from '@/@application/useCases/interfaces/carRepair/IBodyMaterialUseCase';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { BodyMaterialViewModel } from '@/@presentation/types/models/carRepair/BodyMaterialViewModel';
import { computed, ref } from 'vue';

export function useBodyMaterialState(): IBodyMaterialState {
  const bodyMaterialUseCase = container.get<IBodyMaterialUseCase>(SYMBOLS.UseCases.CarRepair.BodyMaterialUseCase);
  const _bodyMaterials = ref<BodyMaterialViewModel[]>([]);
  const _selectedBodyMaterial = ref<BodyMaterialViewModel>({
    id: undefined,
    name: '',
    code: '',
  });
  const loading = ref<boolean>(false);
  const error = ref<unknown>(null);

  const init = async () => {
    return fetchBodyMaterials().then(() => {
      return
    })
  }

  const fetchBodyMaterials = async (): Promise<BodyMaterialViewModel[]> => {
    loading.value = true;
    try {
      return bodyMaterialUseCase.executeGetAll().then((data) => {
        _bodyMaterials.value = data;
        return data;
      });
    } catch (e) {
      // error.value = e;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const selectBodyMaterial = (bodyMaterial: BodyMaterialViewModel | null): void => {    
    if (!bodyMaterial)
      return resetSelectedBodyMaterial();

    const exists = _bodyMaterials.value.find((bp) => bp.id === bodyMaterial.id);
    if (!exists)
      throw new Error('Body part does not exist');

    console.log('useBodyMaterial.selectBodyMaterial', bodyMaterial);

    _selectedBodyMaterial.value = bodyMaterial;
  }

  const resetSelectedBodyMaterial = (): void => {
    _selectedBodyMaterial.value = {
      id: undefined,
      name: '',
      code: '',
    };
  }

  const addBodyMaterial = async (bodyMaterial: BodyMaterialViewModel): Promise<BodyMaterialViewModel> => {
    loading.value = true;
    try {
      return bodyMaterialUseCase.executeCreate(bodyMaterial).then((data) => {
        _bodyMaterials.value.push(data);
        resetSelectedBodyMaterial();
        return data;
      });
    } catch (e) {
      // error.value = e;
      throw e;
    } finally {
      loading.value = false;
    }
  }

  const updateBodyMaterial = async (bodyMaterial: BodyMaterialViewModel): Promise<BodyMaterialViewModel> => {
    if (!bodyMaterial.id)
      throw new Error('Body part does not exist');

    const exist = _bodyMaterials.value.find((bp) => bp.id === bodyMaterial.id);
    if (!exist)
      throw new Error('Body part does not exist');

    loading.value = true;
    try {
      return bodyMaterialUseCase.executeUpdate(bodyMaterial).then((data) => {
        _bodyMaterials.value = _bodyMaterials.value.map((bp) => bp.id === bodyMaterial.id ? data : bp);
        return data;
      });
    } catch (e) {
      // error.value = e;
      throw e;
    } finally {
      loading.value = false;
    }
  }

  const deleteBodyMaterial = async (bodyMaterialUid: string): Promise<void> => {
    if (!bodyMaterialUid)
      throw new Error('Body part does not exist');

    const exist = _bodyMaterials.value.find((bp) => bp.id === bodyMaterialUid);
    if (!exist)
      throw new Error('Body part does not exist');

    loading.value = true;
    try {
      return bodyMaterialUseCase.executeDelete(bodyMaterialUid).then(() => {
        _bodyMaterials.value = _bodyMaterials.value.filter((bp) => bp.id !== bodyMaterialUid);
      });
    } catch (e) {
      // error.value = e;
      throw e;
    } finally {
      loading.value = false;
    }
  }

  return {
    bodyMaterials: computed(() => _bodyMaterials.value),
    selectedBodyMaterial: computed(() => _selectedBodyMaterial.value),
    loading,
    error,
    init,
    fetchBodyMaterials,
    selectBodyMaterial,
    addBodyMaterial,
    updateBodyMaterial,
    deleteBodyMaterial,
  };
}