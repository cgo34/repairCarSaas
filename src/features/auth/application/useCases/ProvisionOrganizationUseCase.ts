import { IOrganizationRepository } from '@/features/organizations/application/ports/repositories/IOrganizationRepository';
import { ISettingPriceRepository } from '@/features/priceSettings/application/ports/repositories/ISettingPriceRepository';

export interface IProvisionOrganizationUseCase {
  /**
   * Idempotent: provisions the organization, admin membership and Free plan
   * server-side for the authenticated user, then seeds default price settings.
   * Safe to call again after a partial failure.
   */
  execute(fullName: string): Promise<string>;
}

export class ProvisionOrganizationUseCase implements IProvisionOrganizationUseCase {
  constructor(
    private readonly organizationRepository: IOrganizationRepository,
    private readonly settingPriceRepository: ISettingPriceRepository
  ) {}

  async execute(fullName: string): Promise<string> {
    const workspaceName = fullName.trim() ? `${fullName.trim()}'s workspace` : 'My workspace';
    const organizationId = await this.organizationRepository.provision(workspaceName);

    // createForUser is idempotent
    await this.settingPriceRepository.createForUser(organizationId);

    return organizationId;
  }
}
