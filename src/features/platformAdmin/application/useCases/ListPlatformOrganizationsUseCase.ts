import type { PlatformOrganizationDto } from '@/features/platformAdmin/application/dtos/PlatformOrganizationDto';
import type { IPlatformOrganizationRepository } from '@/features/platformAdmin/application/ports/repositories/IPlatformOrganizationRepository';

export interface IListPlatformOrganizationsUseCase {
  execute(): Promise<PlatformOrganizationDto[]>;
}

export class ListPlatformOrganizationsUseCase implements IListPlatformOrganizationsUseCase {
  constructor(private readonly repository: IPlatformOrganizationRepository) {}

  execute(): Promise<PlatformOrganizationDto[]> {
    return this.repository.list();
  }
}
