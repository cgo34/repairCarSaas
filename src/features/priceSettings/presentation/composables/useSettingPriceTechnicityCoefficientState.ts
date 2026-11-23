import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { ISettingPriceTechnicityCoefficientUseCase } from '@/features/priceSettings/application/useCases/SettingPriceTechnicityCoefficientUseCase';
import { SettingPriceTechnicityCoefficientMapper } from '@/features/priceSettings/presentation/mappers/SettingPriceTechnicityCoefficientMapper';
import { IUseSettingPriceTechnicityCoefficientState } from '@/features/priceSettings/presentation/types/IUseSettingPriceTechnicityCoefficientState';
import { SettingPriceTechnicityCoefficientViewModel } from '@/features/priceSettings/presentation/models/SettingPriceTechnicityCoefficientViewModel';
import { computed, ref } from 'vue';

export interface UseSettingPriceTechnicityCoefficientStateDependencies {
  authState: IAuthState;
  useCase: ISettingPriceTechnicityCoefficientUseCase;
}

export function createUseSettingPriceTechnicityCoefficientState(deps: UseSettingPriceTechnicityCoefficientStateDependencies): IUseSettingPriceTechnicityCoefficientState {
  const { authState, useCase } = deps;

  const _settings = ref<SettingPriceTechnicityCoefficientViewModel>({
    id: undefined,
    userId: '',
    diameter25Coefficient: 0,
    diameter35Coefficient: 0,
    dapCoefficient: 0,
    dspCoefficient: 0,
    aluminiumCoefficient: 0,
  });
  
  const loading = ref<boolean>(false);
  const error = ref<unknown>(null);

  const init = async () => {
    return fetchSettings().then(() => {
      return;
    });
  };

  const fetchSettings = async (): Promise<SettingPriceTechnicityCoefficientViewModel> => {
    loading.value = true;
    try {
      if (!authState.userContext.value?.id) throw new Error('User does not exist');

      return useCase.getByOrganizationId(authState.userContext.value?.organization.id).then(async (dto) => {      
        if (!dto) {
          await useCase.getAdmin().then((adminDto) => {
            const adminView = SettingPriceTechnicityCoefficientMapper.dtoToView(adminDto);
            _settings.value.id = undefined
            _settings.value.diameter25Coefficient = adminView.diameter25Coefficient
            _settings.value.diameter35Coefficient = adminView.diameter35Coefficient
            _settings.value.dapCoefficient = adminView.dapCoefficient
            _settings.value.dspCoefficient = adminView.dspCoefficient
            _settings.value.aluminiumCoefficient = adminView.aluminiumCoefficient
            _settings.value.userId = authState.userContext.value?.organization.id ?? ''
            return _settings.value;
          })

          return _settings.value
        }

        _settings.value = SettingPriceTechnicityCoefficientMapper.dtoToView(dto);
        return _settings.value;
      });
    } catch (e) {
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const saveSettingTechnicityCoefficient = async () => {
    loading.value = true;
    try {
      const dto = SettingPriceTechnicityCoefficientMapper.viewToDto(_settings.value);
      return useCase.save(dto).then(savedDto => {
        _settings.value = SettingPriceTechnicityCoefficientMapper.dtoToView(savedDto);
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
    saveSettingTechnicityCoefficient
  };
}
