import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';
import type { IListPlatformOrganizationsUseCase } from '@/features/platformAdmin/application/useCases/ListPlatformOrganizationsUseCase';
import type { IGrantPremiumUseCase } from '@/features/platformAdmin/application/useCases/GrantPremiumUseCase';
import type { IGrantFeatureUseCase } from '@/features/platformAdmin/application/useCases/GrantFeatureUseCase';
import type { ISetOrganizationDemoUseCase } from '@/features/platformAdmin/application/useCases/SetOrganizationDemoUseCase';
import { createUsePlatformOrganizations, type IUsePlatformOrganizations } from '@/features/platformAdmin/presentation/composables/usePlatformOrganizations';

export function usePlatformOrganizations(): IUsePlatformOrganizations {
  return createUsePlatformOrganizations({
    setOrganizationDemoUseCase: container.get<ISetOrganizationDemoUseCase>(SYMBOLS.UseCases.PlatformAdmin.SetOrganizationDemoUseCase),
    listPlatformOrganizationsUseCase: container.get<IListPlatformOrganizationsUseCase>(SYMBOLS.UseCases.PlatformAdmin.ListPlatformOrganizationsUseCase),
    grantPremiumUseCase: container.get<IGrantPremiumUseCase>(SYMBOLS.UseCases.PlatformAdmin.GrantPremiumUseCase),
    grantFeatureUseCase: container.get<IGrantFeatureUseCase>(SYMBOLS.UseCases.PlatformAdmin.GrantFeatureUseCase),
  });
}
