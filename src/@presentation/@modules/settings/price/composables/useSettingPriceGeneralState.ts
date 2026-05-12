import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { ISettingPriceGeneralUseCase } from '@/@domain/useCases/settings/price/ISettingPriceGeneralUseCase';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { IUseSettingPriceGeneralState } from '@/@presentation/types/composables/settings/price/IUseSettingPriceGeneralState';
import { SettingPriceGeneralViewModel } from '@/@presentation/types/models/settings/price/SettingPriceGeneralViewModel';
import { computed, ref } from 'vue';

export function useSettingPriceGeneralState(): IUseSettingPriceGeneralState {
  const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);
  const settingPriceGeneralUseCase = container.get<ISettingPriceGeneralUseCase>(SYMBOLS.UseCases.Setting.Price.GeneralUseCase);
  const _settings = ref<SettingPriceGeneralViewModel>({
    id: undefined,
    userId: '',
    hourlyRate: 0,
    unitTime: 0,
  });
  const _selectedSetting = ref<SettingPriceGeneralViewModel>({
    id: undefined,
    userId: '',
    hourlyRate: 0,
    unitTime: 0,
  });
  const loading = ref<boolean>(false);
  const error = ref<unknown>(null);

  const init = async () => {
    return fetchSettings().then(() => {
      return
    })
  }

  const fetchSettings = async (): Promise<SettingPriceGeneralViewModel> => {
    loading.value = true;
    try {
      if (!authState.userContext.value?.id)
        throw new Error('User does not exist');

      return settingPriceGeneralUseCase.getByUserId(authState.userContext.value?.id).then((data) => {        
        if (!data) {
          settingPriceGeneralUseCase.getAdmin().then((adminData) => {            
            _settings.value.hourlyRate = adminData.hourlyRate;
            _settings.value.unitTime = adminData.unitTime;
            _settings.value.userId = authState.user?.value?.id ?? ''
            return _settings.value;
          })

          return _settings.value
        }

        _settings.value = data;
        return _settings.value;
      });
    } catch (e) {
      // error.value = e;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const saveSettingPriceGeneral = async () => {
    loading.value = true;
    try {
      return settingPriceGeneralUseCase.save(_settings.value).then(data => {
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
    saveSettingPriceGeneral,
  };
}