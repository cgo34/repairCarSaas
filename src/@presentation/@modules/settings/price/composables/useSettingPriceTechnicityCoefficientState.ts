import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { ISettingPriceTechnicityCoefficientUseCase } from '@/@domain/useCases/settings/price/ISettingPriceTechnicityCoefficientUseCase';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { SettingPriceTechnicityCoefficientMapper } from '@/@presentation/mappers/settings/price/SettingPriceTechnicityCoefficientMapper';
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

      return useCase.getByUserId(authState.user?.value?.id).then((dto) => {      
        if (!dto) {
          useCase.getAdmin().then((adminDto) => {
            const adminView = SettingPriceTechnicityCoefficientMapper.dtoToView(adminDto);
            _settings.value.id = undefined
            _settings.value.diameter25Coefficient = adminView.diameter25Coefficient
            _settings.value.diameter35Coefficient = adminView.diameter35Coefficient
            _settings.value.dapCoefficient = adminView.dapCoefficient
            _settings.value.dspCoefficient = adminView.dspCoefficient
            _settings.value.aluminiumCoefficient = adminView.aluminiumCoefficient
            _settings.value.userId = authState.user?.value?.id ?? ''
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
