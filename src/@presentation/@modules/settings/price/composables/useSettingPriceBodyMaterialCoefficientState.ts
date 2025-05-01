import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { IBodyMaterialUseCase } from '@/@domain/useCases/carRepair/IBodyMaterialUseCase';
import { ISettingPriceBodyMaterialCoefficientUseCase } from '@/@domain/useCases/settings/price/ISettingPriceBodyMaterialCoefficientUseCase';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { SettingPriceBodyMaterialCoefficientMapper } from '@/@presentation/mappers/settings/price/SettingPriceBodyMaterialCoefficientMapper';
import { IUseSettingPriceBodyMaterialCoefficientState } from '@/@presentation/types/composables/settings/price/IUseSettingPriceBodyMaterialCoefficientState';
import { BodyMaterialViewModel } from '@/@presentation/types/models/carRepair/BodyMaterialViewModel';
import { SettingPriceBodyMaterialCoefficientViewModel } from '@/@presentation/types/models/settings/price/SettingPriceBodyMaterialCoefficientViewModel';
import { computed, ref } from 'vue';

export function useSettingPriceBodyMaterialCoefficientState(): IUseSettingPriceBodyMaterialCoefficientState {
  const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);
  const useCase = container.get<ISettingPriceBodyMaterialCoefficientUseCase>(
    SYMBOLS.UseCases.Setting.Price.BodyMaterialCoefficientUseCase
  );
  const bodyMaterialUseCase = container.get<IBodyMaterialUseCase>(SYMBOLS.UseCases.CarRepair.BodyMaterialUseCase);

  const _bodyMaterials = ref<BodyMaterialViewModel[]>([]);
  const _settings = ref<SettingPriceBodyMaterialCoefficientViewModel[]>([]);
  const _selectedSetting = ref<SettingPriceBodyMaterialCoefficientViewModel>({
    userId: '',
    bodyMaterialId: undefined,
    coefficient: 0,
    bodyMaterials: {
      id: '',
      name: '',
      code: '',
    }
  });
  const loading = ref<boolean>(false);
  const error = ref<unknown>(null);

  const init = async () => {
    fetchBodyMaterials().then(() => {
      return;
    });

    return fetchSettings().then(() => {
      return;
    });
  };

  const fetchBodyMaterials = async (): Promise<BodyMaterialViewModel[]> => {
    loading.value = true;
    try {
      return bodyMaterialUseCase.executeGetAll().then((data) => {
        _bodyMaterials.value = data;
        return data;
      });
    } catch (e) {
      throw e;
    } finally {
      loading.value = false;
    }
  }

  const fetchSettings = async (): Promise<SettingPriceBodyMaterialCoefficientViewModel[]> => {
    loading.value = true;
    try {
      if (!authState.user?.value?.id) throw new Error('User does not exist');

      return useCase.getByUserId(authState.user?.value?.id).then((data) => {
        _settings.value = data.map((s) => SettingPriceBodyMaterialCoefficientMapper.dtoToView(s));
        return _settings.value;
      });
    } catch (e) {
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const selectSetting = (setting: SettingPriceBodyMaterialCoefficientViewModel): void => {
    _selectedSetting.value = setting;
  };

  const resetSelectedSetting = (): void => {
    _selectedSetting.value = {
      userId: '',
      bodyMaterialId: undefined,
      coefficient: 0,
      bodyMaterials: {
        id: '',
        name: '',
        code: '',
      }
    };
  };

  const addSetting = async (setting: SettingPriceBodyMaterialCoefficientViewModel) => {
    loading.value = true;
    try {
      setting.userId = authState.user?.value?.id || '';

      return useCase.create(SettingPriceBodyMaterialCoefficientMapper.viewToDto(setting)).then((data) => {
        _settings.value.push(SettingPriceBodyMaterialCoefficientMapper.dtoToView(data));
        resetSelectedSetting();
        return SettingPriceBodyMaterialCoefficientMapper.dtoToView(data);
      });
    } finally {
      loading.value = false;
    }
  };

  const updateSetting = async (setting: SettingPriceBodyMaterialCoefficientViewModel) => {
    loading.value = true;
    try {
      return useCase.update(SettingPriceBodyMaterialCoefficientMapper.viewToDto(setting)).then((data) => {
        _settings.value = _settings.value.map((s) => (
          s.bodyMaterialId === setting.bodyMaterialId
          ? SettingPriceBodyMaterialCoefficientMapper.dtoToView(data)
          : s
        ));
        return SettingPriceBodyMaterialCoefficientMapper.dtoToView(data);
      });
    } finally {
      loading.value = false;
    }
  };

  const deleteSetting = async (bodyMaterialId: string) => {
    if (!authState.user?.value?.id)
      throw new Error('User does not exist');
    
    loading.value = true;
    try {
      return useCase.delete(bodyMaterialId, authState.user?.value?.id).then(() => {
        _settings.value = _settings.value.filter((s) => s.bodyMaterialId !== bodyMaterialId);
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
    resetSelectedSetting,
    bodyMaterials: computed(() => _bodyMaterials.value),
  };
}
