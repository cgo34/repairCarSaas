import type { OrganizationFeatures } from '@/features/featureAccess/domain/entities/OrganizationFeatures'

export interface IFeatureAccessRepository {
  getForOrganization(organizationId: string): Promise<OrganizationFeatures>
}
