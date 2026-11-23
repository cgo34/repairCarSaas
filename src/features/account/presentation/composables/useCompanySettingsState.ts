import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { ICompanySettingsUseCase } from '@/features/account/application/useCases/CompanySettingsUseCase';
import { CompanySettingsMapper } from '@/features/account/presentation/mappers/CompanySettingsMapper';
import { IUseCompanySettingsState } from '@/features/account/presentation/types/IUseCompanySettingsState';
import { CompanySettingsViewModel } from '@/features/account/presentation/models/CompanySettingsViewModel';
import { computed, ref } from 'vue';

export interface UseCompanySettingsStateDependencies {
  authState: IAuthState;
  companySettingsUseCase: ICompanySettingsUseCase;
}

export function createUseCompanySettingsState(deps: UseCompanySettingsStateDependencies): IUseCompanySettingsState {
  const { authState, companySettingsUseCase } = deps;

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
