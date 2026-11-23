import type { Container } from 'inversify';
import { SYMBOLS } from '@/app/di/tokens';
import { CompanySettingsUseCase } from '@/features/account/application/useCases/CompanySettingsUseCase';
import { ICompanySettingsRepository } from '@/features/account/application/ports/repositories/ICompanySettingsRepository';
import { ICompanySettingsUseCase } from '@/features/account/application/useCases/CompanySettingsUseCase';
import { CompanySettingsRepository } from '@/features/account/infrastructure/repositories/CompanySettingsRepository';
import { useCompanySettingsState } from '@/features/account/composition/useCompanySettingsState';
import { useProfileState } from '@/features/account/composition/useProfileState';
import { IUseCompanySettingsState } from '@/features/account/presentation/types/IUseCompanySettingsState';
import { IUseProfileState } from '@/features/account/presentation/types/IUseProfileState';

export function registerAccountBindings(container: Container): void {
  container.bind<ICompanySettingsRepository>(SYMBOLS.Repositories.CompanySettingsRepository).toDynamicValue(ctx => new CompanySettingsRepository(ctx.container.get(SYMBOLS.Providers.ClientProvider))).inSingletonScope();
  container.bind<ICompanySettingsUseCase>(SYMBOLS.UseCases.CompanySettings).toDynamicValue(ctx => new CompanySettingsUseCase(ctx.container.get(SYMBOLS.Repositories.CompanySettingsRepository))).inSingletonScope();
  container.bind<IUseCompanySettingsState>(SYMBOLS.States.CompanySettingsState).toDynamicValue(() => {
    return useCompanySettingsState();
  });
  container.bind<IUseProfileState>(SYMBOLS.States.ProfileState).toDynamicValue(() => {
    return useProfileState();
  });
}
