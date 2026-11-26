import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';
import type { IListPlatformUsersUseCase } from '@/features/platformAdmin/application/useCases/ListPlatformUsersUseCase';
import { createUsePlatformUsers, type IUsePlatformUsers } from '@/features/platformAdmin/presentation/composables/usePlatformUsers';

export function usePlatformUsers(): IUsePlatformUsers {
  return createUsePlatformUsers({
    listPlatformUsersUseCase: container.get<IListPlatformUsersUseCase>(SYMBOLS.UseCases.PlatformAdmin.ListPlatformUsersUseCase),
  });
}
