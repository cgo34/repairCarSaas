import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { ISettingPriceTechnicityCoefficientUseCase } from '@/@domain/useCases/settings/price/ISettingPriceTechnicityCoefficientUseCase';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { IUseSettingPriceTechnicityCoefficientState } from '@/@presentation/types/composables/settings/price/IUseSettingPriceTechnicityCoefficientState';
import { SettingPriceTechnicityCoefficientViewModel } from '@/@presentation/types/models/settings/price/SettingPriceTechnicityCoefficientViewModel';
import { computed, ref } from 'vue';

export function useSettingPriceTechnicityCoefficientState(): IUseSettingPriceTechnicityCoefficientState {
  const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);
  const useCase = container.get<ISettingPriceTechnicityCoefficientUseCase>(
    SYMBOLS.UseCases.Setting.Price.TechnicityCoefficientUseCase
  );

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
      if (!authState.user?.value?.id) throw new Error('User does not exist');

      return useCase.getByUserId(authState.user?.value?.id).then((data) => {      
        if (!data) {
          useCase.getAdmin().then((adminData) => {         
            _settings.value.id = undefined
            _settings.value.diameter25Coefficient = adminData.diameter25Coefficient
            _settings.value.diameter35Coefficient = adminData.diameter35Coefficient
            _settings.value.dapCoefficient = adminData.dapCoefficient
            _settings.value.dspCoefficient = adminData.dspCoefficient
            _settings.value.aluminiumCoefficient = adminData.aluminiumCoefficient
            _settings.value.userId = authState.user?.value?.id ?? ''
            return _settings.value;
          })

          return _settings.value
        }

        _settings.value = data;
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
      return useCase.save(_settings.value).then(data => {
        _settings.value = data
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
