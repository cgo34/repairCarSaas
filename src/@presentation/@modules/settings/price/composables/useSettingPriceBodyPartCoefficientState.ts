import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { ISettingPriceBodyPartCoefficientUseCase } from '@/@application/useCases/interfaces/settings/price/ISettingPriceBodyPartCoefficientUseCase';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { IUseSettingPriceBodyPartCoefficientState } from '@/@presentation/types/composables/settings/price/IUseSettingPriceBodyPartCoefficientState';
import { SettingPriceBodyPartCoefficientViewModel } from '@/@presentation/types/models/settings/price/SettingPriceBodyPartCoefficientViewModel';
import { computed, ref } from 'vue';

export function useSettingPriceBodyPartCoefficientState(): IUseSettingPriceBodyPartCoefficientState {
  const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);
  const useCase = container.get<ISettingPriceBodyPartCoefficientUseCase>(
    SYMBOLS.UseCases.Setting.Price.BodyPartCoefficientUseCase
  );
  const _settings = ref<SettingPriceBodyPartCoefficientViewModel[]>([]);
  const _selectedSetting = ref<SettingPriceBodyPartCoefficientViewModel | null>(null);
  const loading = ref<boolean>(false);
  const error = ref<unknown>(null);

  const init = async () => {
    return fetchSettings().then(() => {
      return;
    });
  };

  const fetchSettings = async (): Promise<SettingPriceBodyPartCoefficientViewModel[]> => {
    loading.value = true;
    try {
      if (!authState.user?.value?.id) throw new Error('User does not exist');

      return useCase.getByUserId(authState.user?.value?.id).then((data) => {
        _settings.value = data;
        return data;
      });
    } catch (e) {
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const selectSetting = (setting: SettingPriceBodyPartCoefficientViewModel | null): void => {
    _selectedSetting.value = setting;
  };

  const addSetting = async (setting: SettingPriceBodyPartCoefficientViewModel) => {
    loading.value = true;
    try {
      setting.userId = authState.user?.value?.id || '';
      return useCase.create(setting).then((data) => {
        _settings.value.push(data);
        return data;
      });
    } finally {
      loading.value = false;
    }
  };

  const updateSetting = async (setting: SettingPriceBodyPartCoefficientViewModel) => {
    loading.value = true;
    try {
      return useCase.update(setting).then((data) => {
        _settings.value = _settings.value.map((s) => (s.id === setting.id ? data : s));
        return data;
      });
    } finally {
      loading.value = false;
    }
  };

  const deleteSetting = async (id: string) => {
    loading.value = true;
    try {
      return useCase.delete(id).then(() => {
        _settings.value = _settings.value.filter((s) => s.id !== id);
      });
    } finally {
      loading.value = false;
    }
  };

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
  };
}
