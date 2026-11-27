import type { IPlatformOrganizationRepository } from '@/features/platformAdmin/application/ports/repositories/IPlatformOrganizationRepository';

export interface ISetOrganizationDemoUseCase {
  execute(organizationId: string, isDemo: boolean): Promise<void>;
}

export class SetOrganizationDemoUseCase implements ISetOrganizationDemoUseCase {
  constructor(private readonly repository: IPlatformOrganizationRepository) {}

  execute(organizationId: string, isDemo: boolean): Promise<void> {
    return this.repository.setDemo(organizationId, isDemo);
  }
}
