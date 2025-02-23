import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { ISettingPriceBodyMaterialCoefficientUseCase } from '@/@application/useCases/interfaces/settings/price/ISettingPriceBodyMaterialCoefficientUseCase';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { IUseSettingPriceBodyMaterialCoefficientState } from '@/@presentation/types/composables/settings/price/IUseSettingPriceBodyMaterialCoefficientState';
import { SettingPriceBodyMaterialCoefficientViewModel } from '@/@presentation/types/models/settings/price/SettingPriceBodyMaterialCoefficientViewModel';
import { computed, ref } from 'vue';

export function useSettingPriceBodyMaterialCoefficientState(): IUseSettingPriceBodyMaterialCoefficientState {
  const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);
  const useCase = container.get<ISettingPriceBodyMaterialCoefficientUseCase>(
    SYMBOLS.UseCases.Setting.Price.BodyMaterialCoefficientUseCase
  );

  const _settings = ref<SettingPriceBodyMaterialCoefficientViewModel[]>([]);
  const _selectedSetting = ref<SettingPriceBodyMaterialCoefficientViewModel | null>(null);
  const loading = ref<boolean>(false);
  const error = ref<unknown>(null);

  const init = async () => {
    return fetchSettings().then(() => {
      return;
    });
  };

  const fetchSettings = async (): Promise<SettingPriceBodyMaterialCoefficientViewModel[]> => {
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

  const selectSetting = (setting: SettingPriceBodyMaterialCoefficientViewModel | null): void => {
    _selectedSetting.value = setting;
  };

  const addSetting = async (setting: SettingPriceBodyMaterialCoefficientViewModel) => {
    loading.value = true;
    try {
      return useCase.create(setting).then((data) => {
        _settings.value.push(data);
        return data;
      });
    } finally {
      loading.value = false;
    }
  };

  const updateSetting = async (setting: SettingPriceBodyMaterialCoefficientViewModel) => {
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
