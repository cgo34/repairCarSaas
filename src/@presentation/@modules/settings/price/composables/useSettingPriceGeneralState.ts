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
  const _settings = ref<SettingPriceGeneralViewModel[]>([]);
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

  const fetchSettings = async (): Promise<SettingPriceGeneralViewModel[]> => {
    loading.value = true;
    try {
      if (!authState.user?.value?.id)
        throw new Error('User does not exist');

      return settingPriceGeneralUseCase.getByUserId(authState.user?.value?.id).then((data) => {
        _settings.value = data;
        return data;
      });
    } catch (e) {
      // error.value = e;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const selectSetting = (settingPriceGeneral: SettingPriceGeneralViewModel | null): void => {    
    if (!settingPriceGeneral)
      return resetSelectedSetting();

    const exists = _settings.value.find((bp) => bp.id === settingPriceGeneral.id);
    if (!exists)
      throw new Error('Body part does not exist');

    _selectedSetting.value = settingPriceGeneral;
  }

  const resetSelectedSetting = (): void => {
    _selectedSetting.value = {
      id: '',
      userId: '',
      hourlyRate: 0,
      unitTime: 0,
    };
  }

  const addSetting = async (settingPriceGeneral: SettingPriceGeneralViewModel): Promise<SettingPriceGeneralViewModel> => {
    loading.value = true;
    try {
      settingPriceGeneral.userId = authState.user?.value?.id || '';
      return settingPriceGeneralUseCase.create(settingPriceGeneral).then((data) => {
        _settings.value.push(data);
        resetSelectedSetting();
        return data;
      });
    } catch (e) {
      // error.value = e;
      throw e;
    } finally {
      loading.value = false;
    }
  }

  const updateSetting = async (settingPriceGeneral: SettingPriceGeneralViewModel): Promise<SettingPriceGeneralViewModel> => {
    if (!settingPriceGeneral.id)
      throw new Error('Body part does not exist');

    const exist = _settings.value.find((bp) => bp.id === settingPriceGeneral.id);
    if (!exist)
      throw new Error('Body part does not exist');

    loading.value = true;
    try {
      return settingPriceGeneralUseCase.update(settingPriceGeneral).then((data) => {
        _settings.value = _settings.value.map((bp) => bp.id === settingPriceGeneral.id ? data : bp);
        return data;
      });
    } catch (e) {
      // error.value = e;
      throw e;
    } finally {
      loading.value = false;
    }
  }

  const deleteSetting = async (settingPriceGeneralUid: string): Promise<void> => {
    if (!settingPriceGeneralUid)
      throw new Error('Body part does not exist');

    const exist = _settings.value.find((bp) => bp.id === settingPriceGeneralUid);
    if (!exist)
      throw new Error('Body part does not exist');

    loading.value = true;
    try {
      return settingPriceGeneralUseCase.delete(settingPriceGeneralUid).then(() => {
        _settings.value = _settings.value.filter((bp) => bp.id !== settingPriceGeneralUid);
      });
    } catch (e) {
      // error.value = e;
      throw e;
    } finally {
      loading.value = false;
    }
  }

  return {
    settings: computed(() => _settings.value),
    selectedSetting: computed(() => _selectedSetting.value),
    loading,
    error,
    init,
    fetchSettings,
    selectSetting,
    addSetting,
    updateSetting,
    deleteSetting,
    resetSelectedSetting
  };
}