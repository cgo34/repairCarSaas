import type { PlatformUserDto } from '@/features/platformAdmin/application/dtos/PlatformUserDto';
import type { IPlatformUserRepository } from '@/features/platformAdmin/application/ports/repositories/IPlatformUserRepository';

export interface IListPlatformUsersUseCase {
  execute(): Promise<PlatformUserDto[]>;
}

export class ListPlatformUsersUseCase implements IListPlatformUsersUseCase {
  constructor(private readonly repository: IPlatformUserRepository) {}

  execute(): Promise<PlatformUserDto[]> {
    return this.repository.list();
  }
}
