import type { Ref, ShallowRef } from 'vue'
import type { OrganizationFeatures } from '@/features/featureAccess/domain/entities/OrganizationFeatures'

export interface IFeatureAccessState {
  features: ShallowRef<OrganizationFeatures>
  isLoading: Ref<boolean>
  // Loads only when the organization changed; no-op otherwise
  ensureLoaded(organizationId: string): Promise<void>
  // Forces a reload (after a gift, plan change, tab focus...)
  refresh(organizationId: string): Promise<void>
  reset(): void
}
