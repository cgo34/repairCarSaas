import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';
import type { IListPlatformOrganizationsUseCase } from '@/features/platformAdmin/application/useCases/ListPlatformOrganizationsUseCase';
import { createUsePlatformOrganizations, type IUsePlatformOrganizations } from '@/features/platformAdmin/presentation/composables/usePlatformOrganizations';

export function usePlatformOrganizations(): IUsePlatformOrganizations {
  return createUsePlatformOrganizations({
    listPlatformOrganizationsUseCase: container.get<IListPlatformOrganizationsUseCase>(SYMBOLS.UseCases.PlatformAdmin.ListPlatformOrganizationsUseCase),
  });
}
