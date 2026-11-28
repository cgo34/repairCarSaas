import type { PlatformOrganizationDto } from '@/features/platformAdmin/application/dtos/PlatformOrganizationDto';
import type { FeatureGrantDuration } from '@/features/platformAdmin/application/dtos/FeatureGrant';
import type { PremiumGrantDuration } from '@/features/platformAdmin/application/dtos/PremiumGrantDuration';

export interface IPlatformOrganizationRepository {
  list(): Promise<PlatformOrganizationDto[]>;
  grantPremium(organizationId: string, duration: PremiumGrantDuration): Promise<void>;
  setDemo(organizationId: string, isDemo: boolean): Promise<void>;
  grantFeature(organizationId: string, featureKey: string, duration: FeatureGrantDuration): Promise<void>;
}
