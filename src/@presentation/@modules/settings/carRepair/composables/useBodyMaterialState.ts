import { IBodyMaterialUseCase } from '@/@domain/useCases/carRepair/IBodyMaterialUseCase';
import { IBodyMaterialState } from '@/@presentation/types/composables/IBodyMaterialState';
import { BodyMaterialViewModel } from '@/@presentation/types/models/carRepair/BodyMaterialViewModel';
import { JsonHelper } from '@/helpers/jsonHelper';
import { slugify } from '@/shared/utils/slugify';
import { container } from '@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@infrastructure/ioc/symbols';
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
      return;
    });
  };

  const fetchBodyMaterials = async (): Promise<BodyMaterialViewModel[]> => {
    loading.value = true;
    try {
      return bodyMaterialUseCase.executeGetAll().then((viewModels) => {
        _bodyMaterials.value = viewModels;
        return viewModels;
      });
    } catch (e) {
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const selectBodyMaterial = (bodyMaterial: BodyMaterialViewModel): void => {
    _selectedBodyMaterial.value = JsonHelper.clone(bodyMaterial);
  };

  const resetSelectedBodyMaterial = (): void => {
    _selectedBodyMaterial.value = { id: undefined, name: '', code: '' };
  };

  const addBodyMaterial = async (bodyMaterial: BodyMaterialViewModel): Promise<BodyMaterialViewModel> => {
    bodyMaterial.code = slugify(bodyMaterial.name);
    return bodyMaterialUseCase.executeCreate(bodyMaterial).then((viewModel) => {
      _bodyMaterials.value.push(viewModel);
      resetSelectedBodyMaterial();
      return viewModel;
    });
  };

  const updateBodyMaterial = async (bodyMaterial: BodyMaterialViewModel): Promise<BodyMaterialViewModel> => {
    return bodyMaterialUseCase.executeUpdate(bodyMaterial).then((viewModel) => {
      const index = _bodyMaterials.value.findIndex((bm) => bm.id === viewModel.id);
      if (index !== -1) {
        _bodyMaterials.value[index] = viewModel;
      }
      resetSelectedBodyMaterial();
      return viewModel;
    });
  };

  const deleteBodyMaterial = async (id: string): Promise<void> => {
    return bodyMaterialUseCase.executeDelete(id).then(() => {
      const index = _bodyMaterials.value.findIndex((bm) => bm.id === id);
      if (index !== -1) {
        _bodyMaterials.value.splice(index, 1);
      }
    });
  };

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
    resetSelectedBodyMaterial
  };
}
