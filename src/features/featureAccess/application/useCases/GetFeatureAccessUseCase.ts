import type { OrganizationFeatures } from '@/features/featureAccess/domain/entities/OrganizationFeatures'
import type { IFeatureAccessRepository } from '@/features/featureAccess/application/ports/repositories/IFeatureAccessRepository'

export interface IGetFeatureAccessUseCase {
  execute(organizationId: string): Promise<OrganizationFeatures>
}

export class GetFeatureAccessUseCase implements IGetFeatureAccessUseCase {
  constructor(private readonly repository: IFeatureAccessRepository) {}

  async execute(organizationId: string): Promise<OrganizationFeatures> {
    return this.repository.getForOrganization(organizationId)
  }
}
