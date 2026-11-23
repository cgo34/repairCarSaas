import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { ISettingPriceGeneralUseCase } from '@/features/priceSettings/application/useCases/SettingPriceGeneralUseCase';
import { IUseSettingPriceGeneralState } from '@/features/priceSettings/presentation/types/IUseSettingPriceGeneralState';
import { SettingPriceGeneralViewModel } from '@/features/priceSettings/presentation/models/SettingPriceGeneralViewModel';
import { computed, ref } from 'vue';

export interface UseSettingPriceGeneralStateDependencies {
  authState: IAuthState;
  settingPriceGeneralUseCase: ISettingPriceGeneralUseCase;
}

export function createUseSettingPriceGeneralState(deps: UseSettingPriceGeneralStateDependencies): IUseSettingPriceGeneralState {
  const { authState, settingPriceGeneralUseCase } = deps;
  const _settings = ref<SettingPriceGeneralViewModel>({
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

      return settingPriceGeneralUseCase.getByOrganizationId(authState.userContext.value?.organization.id).then(async (data) => {        
        if (!data) {
          await settingPriceGeneralUseCase.getAdmin().then((adminData) => {            
            _settings.value.hourlyRate = adminData.hourlyRate;
            _settings.value.unitTime = adminData.unitTime;
            _settings.value.userId = authState.userContext.value?.organization.id ?? ''
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