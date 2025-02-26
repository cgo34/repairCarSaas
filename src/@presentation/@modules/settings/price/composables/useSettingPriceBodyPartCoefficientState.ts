import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { IBodyPartUseCase } from '@/@application/useCases/interfaces/carRepair/IBodyPartUseCase';
import { ISettingPriceBodyPartCoefficientUseCase } from '@/@application/useCases/interfaces/settings/price/ISettingPriceBodyPartCoefficientUseCase';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { SettingPriceBodyPartCoefficientMapper } from '@/@presentation/mappers/settings/price/SettingPriceBodyPartCoefficientMapper';
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
  const _selectedSetting = ref<SettingPriceBodyPartCoefficientViewModel>({
    userId: '',
    bodyPartId: '',
    coefficient: 0,
    bodyParts: {
      id: '',
      name: '',
      code: '',
      color: ''
    }
  });
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
        console.log('useSettingPriceBodyMaterialCoefficient.fetchBodyParts', data);
        
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
        _settings.value = data.map((d) => SettingPriceBodyPartCoefficientMapper.dtoToView(d));
        return _settings.value;
      });
    } catch (e) {
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const selectSetting = (setting: SettingPriceBodyPartCoefficientViewModel): void => {
    _selectedSetting.value = setting;
  };

  const resetSelectedSetting = (): void => {
    _selectedSetting.value = {
      userId: '',
      bodyPartId: '',
      coefficient: 0,
      bodyParts: {
        id: '',
        name: '',
        code: '',
        color: ''
      }
    };
  };

  const addSetting = async (setting: SettingPriceBodyPartCoefficientViewModel) => {
    loading.value = true;
    try {
      setting.userId = authState.user?.value?.id || '';
      return useCase.create(setting).then((data) => {
        _settings.value.push(SettingPriceBodyPartCoefficientMapper.dtoToView(data));
        resetSelectedSetting();
        return SettingPriceBodyPartCoefficientMapper.dtoToView(data);
      });
    } finally {
      loading.value = false;
    }
  };

  const updateSetting = async (setting: SettingPriceBodyPartCoefficientViewModel) => {
    loading.value = true;
    try {
      return useCase.update(setting).then((data) => {
        _settings.value = _settings.value.map((s) => (
          s.bodyPartId === setting.bodyPartId
          ? SettingPriceBodyPartCoefficientMapper.dtoToView(data)
          : s
        ));
        return SettingPriceBodyPartCoefficientMapper.dtoToView(data);
      });
    } finally {
      loading.value = false;
    }
  };

  const deleteSetting = async (id: string) => {
    loading.value = true;
    try {
      return useCase.delete(id).then(() => {
        _settings.value = _settings.value.filter((s) => s.bodyPartId !== id);
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
    bodyParts: computed(() => _bodyParts.value)
  };
}
