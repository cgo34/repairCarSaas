import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { IDentRepairTypeUseCase } from '@/@domain/useCases/carRepair/IDentRepairTypeUseCase';
import { ISettingPriceRepairTypeCoefficientUseCase } from '@/@domain/useCases/settings/price/ISettingPriceRepairTypeCoefficientUseCase';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { SettingPriceRepairTypeCoefficientMapper } from '@/@presentation/mappers/settings/price/SettingPriceRepairTypeCoefficientMapper';
import { IUseSettingPriceRepairTypeCoefficientState } from '@/@presentation/types/composables/settings/price/IUseSettingPriceRepairTypeCoefficientState';
import { DentRepairTypeViewModel } from '@/@presentation/types/models/carRepair/DentRepairTypeViewModel';
import { SettingPriceRepairTypeCoefficientViewModel } from '@/@presentation/types/models/settings/price/SettingPriceRepairTypeCoefficientViewModel';
import { computed, ref } from 'vue';

export function useSettingPriceRepairTypeCoefficientState(): IUseSettingPriceRepairTypeCoefficientState {
  const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);
  const useCase = container.get<ISettingPriceRepairTypeCoefficientUseCase>(
    SYMBOLS.UseCases.Setting.Price.RepairTypeCoefficientUseCase
  );
  const repairTypeUseCase = container.get<IDentRepairTypeUseCase>(SYMBOLS.UseCases.CarRepair.DentRepairTypeUseCase);

  const _repairTypes = ref<DentRepairTypeViewModel[]>([]);
  const _settings = ref<SettingPriceRepairTypeCoefficientViewModel[]>([]);
  const _selectedSetting = ref<SettingPriceRepairTypeCoefficientViewModel>({
    userId: '',
    repairTypeId: undefined,
    coefficient: 0,
    repairTypes: {
      id: '',
      name: '',
      code: '',
    }
  });
  const loading = ref<boolean>(false);
  const error = ref<unknown>(null);

  const init = async () => {
    fetchRepairTypes().then(() => {
      return;
    });

    return fetchSettings().then(() => {
      return;
    });
  };

  const fetchRepairTypes = async (): Promise<DentRepairTypeViewModel[]> => {
    loading.value = true;
    try {
      return repairTypeUseCase.executeGetAll().then((data) => {
        _repairTypes.value = data;
        return data;
      });
    } catch (e) {
      throw e;
    } finally {
      loading.value = false;
    }
  }

  const fetchSettings = async (): Promise<SettingPriceRepairTypeCoefficientViewModel[]> => {
    loading.value = true;
    try {
      if (!authState.user?.value?.id) throw new Error('User does not exist');

      return useCase.getByUserId(authState.user?.value?.id).then((data) => {
        _settings.value = data.map((s) => SettingPriceRepairTypeCoefficientMapper.dtoToView(s));
        return _settings.value;
      });
    } catch (e) {
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const selectSetting = (setting: SettingPriceRepairTypeCoefficientViewModel): void => {
    _selectedSetting.value = setting;
  };

  const resetSelectedSetting = (): void => {
    _selectedSetting.value = {
      userId: '',
      repairTypeId: undefined,
      coefficient: 0,
      repairTypes: {
        id: '',
        name: '',
        code: '',
      }
    };
  };

  const addSetting = async (setting: SettingPriceRepairTypeCoefficientViewModel) => {
    loading.value = true;
    try {
      setting.userId = authState.user?.value?.id || '';

      return useCase.create(SettingPriceRepairTypeCoefficientMapper.viewToDto(setting)).then((data) => {
        _settings.value.push(SettingPriceRepairTypeCoefficientMapper.dtoToView(data));
        resetSelectedSetting();
        return SettingPriceRepairTypeCoefficientMapper.dtoToView(data);
      });
    } finally {
      loading.value = false;
    }
  };

  const updateSetting = async (setting: SettingPriceRepairTypeCoefficientViewModel) => {
    loading.value = true;
    try {
      return useCase.update(SettingPriceRepairTypeCoefficientMapper.viewToDto(setting)).then((data) => {
        _settings.value = _settings.value.map((s) => (
          s.repairTypeId === setting.repairTypeId
          ? SettingPriceRepairTypeCoefficientMapper.dtoToView(data)
          : s
        ));
        return SettingPriceRepairTypeCoefficientMapper.dtoToView(data);
      });
    } finally {
      loading.value = false;
    }
  };

  const deleteSetting = async (repairTypeId: string) => {
    if (!authState.user?.value?.id)
      throw new Error('User does not exist');
    
    loading.value = true;
    try {
      return useCase.delete(repairTypeId, authState.user?.value?.id).then(() => {
        _settings.value = _settings.value.filter((s) => s.repairTypeId !== repairTypeId);
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
    repairTypes: computed(() => _repairTypes.value),
  };
}
