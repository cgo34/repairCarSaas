import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { IBodyPartUseCase } from '@/features/carRepairSettings/application/useCases/BodyPartUseCase';
import { ISettingPriceBodyPartCoefficientUseCase } from '@/features/priceSettings/application/useCases/SettingPriceBodyPartCoefficientUseCase';
import { BodyPartMapper } from '@/features/carRepairSettings/presentation/mappers/BodyPartMapper';
import { SettingPriceBodyPartCoefficientMapper } from '@/features/priceSettings/presentation/mappers/SettingPriceBodyPartCoefficientMapper';
import { IUseSettingPriceBodyPartCoefficientState } from '@/features/priceSettings/presentation/types/IUseSettingPriceBodyPartCoefficientState';
import { BodyPartViewModel } from '@/features/carRepairSettings/presentation/models/BodyPartViewModel';
import { SettingPriceBodyPartCoefficientViewModel } from '@/features/priceSettings/presentation/models/SettingPriceBodyPartCoefficientViewModel';
import { computed, ref } from 'vue';

export interface UseSettingPriceBodyPartCoefficientStateDependencies {
  authState: IAuthState;
  useCase: ISettingPriceBodyPartCoefficientUseCase;
  bodyPartUseCase: IBodyPartUseCase;
}

export function createUseSettingPriceBodyPartCoefficientState(deps: UseSettingPriceBodyPartCoefficientStateDependencies): IUseSettingPriceBodyPartCoefficientState {
  const { authState, useCase, bodyPartUseCase } = deps;
  const _bodyParts = ref<BodyPartViewModel[]>([]);
  const _settings = ref<SettingPriceBodyPartCoefficientViewModel[]>([]);

  const loading = ref<boolean>(false);
  const error = ref<unknown>(null);

  const init = async () => {
    fetchBodyParts().then(() => {
      return;
    });

    return fetchSettings().then(() => {
      return;
    });
  };

  const fetchBodyParts = async (): Promise<BodyPartViewModel[]> => {
    loading.value = true;
    try {
      return bodyPartUseCase.executeGetAll().then((data) => {
        const viewModels = data.map((bp) => BodyPartMapper.dtoToView(bp));
        _bodyParts.value = viewModels;
        
        return viewModels;
      });
    } catch (e) {
      throw e;
    } finally {
      loading.value = false;
    }
  }

  const fetchSettings = async (): Promise<SettingPriceBodyPartCoefficientViewModel[]> => {
    loading.value = true;
    try {
      if (!authState.userContext.value?.organization.id) throw new Error('User does not exist');

      return useCase.getByOrganizationId(authState.userContext.value?.organization.id).then(async (dtos) => {    
            
        if (!dtos.length) {
          await useCase.getAdmin().then((adminDtos) => {         
            _settings.value = adminDtos.map((dto) => {
              const viewModel = SettingPriceBodyPartCoefficientMapper.dtoToView(dto);
              return {
                ...viewModel,
                id: undefined,
                userId: authState.userContext.value?.organization.id ?? ''
              }
            })
            
            return _settings.value;
          })

          return _settings.value
        }
        _settings.value = dtos.map(SettingPriceBodyPartCoefficientMapper.dtoToView);
        return _settings.value;
      });

    } catch (e) {
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const saveSettingBodyPartCoefficient = async () => {
    loading.value = true;
    try {
      const dtos = _settings.value.map(SettingPriceBodyPartCoefficientMapper.viewToDto);
      return useCase.save(dtos).then(savedDtos => {
        _settings.value = savedDtos.map(SettingPriceBodyPartCoefficientMapper.dtoToView);
      })
    } catch (e) {
      error.value = e;
      // throw e;
    } finally {
      loading.value = false;
    }
  }

  return {
    settings: computed(() => _settings.value),
    loading,
    error,
    init,
    saveSettingBodyPartCoefficient
  };
}
