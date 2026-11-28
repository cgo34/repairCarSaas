import type { SupabaseClient } from '@/shared/infrastructure/supabase/SupabaseClient'
import type { IClientProvider } from '@/shared/infrastructure/supabase/IClientProvider'
import type { IFeatureAccessRepository } from '@/features/featureAccess/application/ports/repositories/IFeatureAccessRepository'
import { OrganizationFeatures } from '@/features/featureAccess/domain/entities/OrganizationFeatures'
import type { FeatureKey, FeatureValue } from '@/features/featureAccess/domain/types/FeatureKey'

export class FeatureAccessRepository implements IFeatureAccessRepository {
  constructor(private readonly clientProvider: IClientProvider<SupabaseClient>) {}

  async getForOrganization(organizationId: string): Promise<OrganizationFeatures> {
    const { data, error } = await this.clientProvider.getClient()
      .fromView('organization_effective_features')
      .select('feature_key, value')
      .eq('organization_id', organizationId)

    if (error) {
      console.error('[FeatureAccessRepo] getForOrganization error:', error)
      throw error
    }

    const values: Partial<Record<FeatureKey, FeatureValue>> = {}
    for (const row of data ?? []) {
      if (row.feature_key) values[row.feature_key as FeatureKey] = row.value as FeatureValue
    }
    return new OrganizationFeatures(values)
  }
}
