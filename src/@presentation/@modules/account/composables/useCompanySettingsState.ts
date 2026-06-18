import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { ICompanySettingsUseCase } from '@/@domain/useCases/ICompanySettingsUseCase';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { CompanySettingsMapper } from '@/@presentation/mappers/CompanySettingsMapper';
import { IUseCompanySettingsState } from '@/@presentation/types/composables/IUseCompanySettingsState';
import { CompanySettingsViewModel } from '@/@presentation/types/models/CompanySettingsViewModel';
import { computed, ref } from 'vue';

export function useCompanySettingsState(): IUseCompanySettingsState {
  const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);
  const companySettingsUseCase = container.get<ICompanySettingsUseCase>(
    SYMBOLS.UseCases.CompanySettings
  );

  const _settings = ref<CompanySettingsViewModel | null>(null);
  const loading = ref<boolean>(false);
  const error = ref<unknown>(null);

  const init = async (userId: string): Promise<void> => {
    loading.value = true;
    try {
      const dto = await companySettingsUseCase.getByUserId(userId);
      _settings.value = dto ? CompanySettingsMapper.dtoToView(dto) : null;
    } catch (e) {
      error.value = e;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const save = async (vm: CompanySettingsViewModel): Promise<CompanySettingsViewModel> => {
    loading.value = true;
    try {
      const userId = authState.userContext?.value?.id ?? '';
      const dto = CompanySettingsMapper.viewToDto({ ...vm, userId });

      let result;
      if (dto.id) {
        result = await companySettingsUseCase.update(dto);
      } else {
        result = await companySettingsUseCase.create(dto);
      }

      const resultVm = CompanySettingsMapper.dtoToView(result);
      _settings.value = resultVm;
      return resultVm;
    } catch (e) {
      error.value = e;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    settings: computed(() => _settings.value),
    loading,
    error,
    init,
    save,
  };
}
