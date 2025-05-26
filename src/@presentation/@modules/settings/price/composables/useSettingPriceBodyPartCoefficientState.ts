import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { IBodyPartUseCase } from '@/@domain/useCases/carRepair/IBodyPartUseCase';
import { ISettingPriceBodyPartCoefficientUseCase } from '@/@domain/useCases/settings/price/ISettingPriceBodyPartCoefficientUseCase';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { IUseSettingPriceBodyPartCoefficientState } from '@/@presentation/types/composables/settings/price/IUseSettingPriceBodyPartCoefficientState';
import { BodyPartViewModel } from '@/@presentation/types/models/carRepair/BodyPartViewModel';
import { SettingPriceBodyPartCoefficientViewModel } from '@/@presentation/types/models/settings/price/SettingPriceBodyPartCoefficientViewModel';
import { computed, ref } from 'vue';

export function useSettingPriceBodyPartCoefficientState(): IUseSettingPriceBodyPartCoefficientState {
  const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);
  const useCase = container.get<ISettingPriceBodyPartCoefficientUseCase>(
    SYMBOLS.UseCases.Setting.Price.BodyPartCoefficientUseCase
  );
  const bodyPartUseCase = container.get<IBodyPartUseCase>(SYMBOLS.UseCases.CarRepair.BodyPartUseCase);
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
        _bodyParts.value = data;
        
        return data;
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
      if (!authState.user?.value?.id) throw new Error('User does not exist');

      return useCase.getByUserId(authState.user?.value?.id).then((data) => {    
            
        if (!data.length) {
          useCase.getAdmin().then((adminData) => {         
            _settings.value = adminData.map((data) => {
              return {
                ...data,
                id: undefined,
                userId: authState.user?.value?.id
              }
            })
            
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

  const saveSettingBodyPartCoefficient = async () => {
    console.log('saveSettingBodyPartCoefficient');
    
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
    saveSettingBodyPartCoefficient
  };
}
