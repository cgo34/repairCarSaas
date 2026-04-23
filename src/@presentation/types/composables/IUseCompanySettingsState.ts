import { ComputedRef, Ref } from 'vue';
import { CompanySettingsViewModel } from '@/@presentation/types/models/CompanySettingsViewModel';

export interface IUseCompanySettingsState {
  settings: ComputedRef<CompanySettingsViewModel | null>;
  loading: Ref<boolean>;
  error: Ref<unknown>;
  init(userId: string): Promise<void>;
  save(vm: CompanySettingsViewModel): Promise<CompanySettingsViewModel>;
}
