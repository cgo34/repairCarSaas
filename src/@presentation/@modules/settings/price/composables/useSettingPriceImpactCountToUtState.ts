import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { ISettingPriceImpactCountToUtUseCase } from '@/@domain/useCases/settings/price/ISettingPriceImpactCountToUtUseCase';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { SettingPriceImpactCountToUtMapper } from '@/@presentation/mappers/settings/price/SettingPriceImpactCountToUtMapper';
import { IUseSettingPriceImpactCountToUtState } from '@/@presentation/types/composables/settings/price/IUseSettingPriceImpactCountToUtState';
import { SettingPriceImpactCountToUtViewModel } from '@/@presentation/types/models/settings/price/SettingPriceImpactCountToUtViewModel';
import { computed, ref } from 'vue';

export function useSettingPriceImpactCountToUtState(): IUseSettingPriceImpactCountToUtState {
  const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);
  const useCase = container.get<ISettingPriceImpactCountToUtUseCase>(SYMBOLS.UseCases.Setting.Price.ImpactCountToUtUseCase);
  const _settings = ref<SettingPriceImpactCountToUtViewModel[]>([]);
  const _selectedSetting = ref<SettingPriceImpactCountToUtViewModel>({
    id: undefined,
    userId: '',
    impactCountMin: 0,
    impactCountMax: 0,
    unitTime: 0,
  });
  const loading = ref<boolean>(false);
  const error = ref<unknown>(null);

  const init = async () => {
    return fetchSettings().then(() => {
      return;
    });
  };

  const fetchSettings = async (): Promise<SettingPriceImpactCountToUtViewModel[]> => {
    loading.value = true;
    try {
      if (!authState.userContext.value?.id)
        throw new Error('User does not exist');

      return useCase.getByUserId(authState.userContext.value?.id).then((dtos) => {
            
        if (!dtos.length) {
          useCase.getAdmin().then((adminDtos) => {         
            _settings.value = adminDtos.map((dto) => {
              const viewModel = SettingPriceImpactCountToUtMapper.dtoToView(dto);
              return {
                ...viewModel,
                id: undefined,
                userId: authState.userContext.value?.id ?? ''
              }
            })
            
            return _settings.value;
          })

          return _settings.value
        }

        _settings.value = dtos.map(SettingPriceImpactCountToUtMapper.dtoToView);
        return _settings.value;
      });
    } catch (e) {
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const selectSetting = (setting: SettingPriceImpactCountToUtViewModel): void => {
    _selectedSetting.value = setting;
  };

  const resetSelectedSetting = (): void => {
    _selectedSetting.value = {
      id: undefined,
      userId: '',
      impactCountMin: 0,
      impactCountMax: 0,
      unitTime: 0,
    };
  }

  const addSetting = async (setting: SettingPriceImpactCountToUtViewModel) => {
    loading.value = true;
    try {
      setting.userId = authState.userContext.value?.id ?? '';
      const dto = SettingPriceImpactCountToUtMapper.viewToDto(setting);
      return useCase.create(dto).then((createdDto) => {
        const viewModel = SettingPriceImpactCountToUtMapper.dtoToView(createdDto);
        _settings.value.push(viewModel);
        return viewModel;
      });
    } finally {
      loading.value = false;
    }
  };

  const updateSetting = async (setting: SettingPriceImpactCountToUtViewModel) => {
    loading.value = true;
    try {
      const dto = SettingPriceImpactCountToUtMapper.viewToDto(setting);
      return useCase.update(dto).then((updatedDto) => {
        const viewModel = SettingPriceImpactCountToUtMapper.dtoToView(updatedDto);
        _settings.value = _settings.value.map((s) => (s.id === setting.id ? viewModel : s));
        return viewModel;
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

  const saveSettingUnitTime = async () => {
    loading.value = true;
    try {
      const dtos = _settings.value.map(SettingPriceImpactCountToUtMapper.viewToDto);
      return useCase.save(dtos).then(savedDtos => {
        _settings.value = savedDtos.map(SettingPriceImpactCountToUtMapper.dtoToView);
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
    saveSettingUnitTime
  };
}
