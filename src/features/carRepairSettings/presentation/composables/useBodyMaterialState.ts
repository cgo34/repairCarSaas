import { IBodyMaterialUseCase } from '@/features/carRepairSettings/application/useCases/BodyMaterialUseCase';
import { BodyMaterialMapper } from '@/features/carRepairSettings/presentation/mappers/BodyMaterialMapper';
import { IBodyMaterialState } from '@/features/carRepairSettings/presentation/types/IBodyMaterialState';
import { BodyMaterialViewModel } from '@/features/carRepairSettings/presentation/models/BodyMaterialViewModel';
import { JsonHelper } from '@/shared/application/utils/jsonHelper';
import { slugify } from '@/shared/application/utils/slugify';
import { computed, ref } from 'vue';

export interface UseBodyMaterialStateDependencies {
  bodyMaterialUseCase: IBodyMaterialUseCase;
}

export function createUseBodyMaterialState(deps: UseBodyMaterialStateDependencies): IBodyMaterialState {
  const { bodyMaterialUseCase } = deps;
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
      return bodyMaterialUseCase.executeGetAll().then((dtos) => {
        const viewModels = dtos.map((dto) => BodyMaterialMapper.dtoToView(dto));
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
    const dto = BodyMaterialMapper.viewToDto(bodyMaterial);
    return bodyMaterialUseCase.executeCreate(dto).then((createdDto) => {
      const viewModel = BodyMaterialMapper.dtoToView(createdDto);
      _bodyMaterials.value.push(viewModel);
      resetSelectedBodyMaterial();
      return viewModel;
    });
  };

  const updateBodyMaterial = async (bodyMaterial: BodyMaterialViewModel): Promise<BodyMaterialViewModel> => {
    const dto = BodyMaterialMapper.viewToDto(bodyMaterial);
    return bodyMaterialUseCase.executeUpdate(dto).then((updatedDto) => {
      const viewModel = BodyMaterialMapper.dtoToView(updatedDto);
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
