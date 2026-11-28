import type { PremiumGrantDuration } from '@/features/platformAdmin/application/dtos/PremiumGrantDuration';
import type { IPlatformOrganizationRepository } from '@/features/platformAdmin/application/ports/repositories/IPlatformOrganizationRepository';

export interface IGrantPremiumUseCase {
  execute(organizationId: string, duration: PremiumGrantDuration): Promise<void>;
}

export class GrantPremiumUseCase implements IGrantPremiumUseCase {
  constructor(private readonly repository: IPlatformOrganizationRepository) {}

  execute(organizationId: string, duration: PremiumGrantDuration): Promise<void> {
    return this.repository.grantPremium(organizationId, duration);
  }
}
