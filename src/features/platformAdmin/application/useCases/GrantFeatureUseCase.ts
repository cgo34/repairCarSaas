import type { FeatureGrantDuration } from '@/features/platformAdmin/application/dtos/FeatureGrant';
import type { IPlatformOrganizationRepository } from '@/features/platformAdmin/application/ports/repositories/IPlatformOrganizationRepository';

export interface IGrantFeatureUseCase {
  execute(organizationId: string, featureKey: string, duration: FeatureGrantDuration): Promise<void>;
}

export class GrantFeatureUseCase implements IGrantFeatureUseCase {
  constructor(private readonly repository: IPlatformOrganizationRepository) {}

  execute(organizationId: string, featureKey: string, duration: FeatureGrantDuration): Promise<void> {
    return this.repository.grantFeature(organizationId, featureKey, duration);
  }
}
