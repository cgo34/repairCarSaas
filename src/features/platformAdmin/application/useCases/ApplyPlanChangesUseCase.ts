import type { PlanChangeDto } from '@/features/platformAdmin/application/dtos/PlatformPlanDto';
import type { IPlatformPlanRepository } from '@/features/platformAdmin/application/ports/repositories/IPlatformPlanRepository';
import { assertValidPlanChanges } from '@/features/platformAdmin/application/useCases/assertValidPlanChanges';

export interface IApplyPlanChangesUseCase {
  execute(changes: PlanChangeDto[]): Promise<number>;
}

export class ApplyPlanChangesUseCase implements IApplyPlanChangesUseCase {
  constructor(private readonly repository: IPlatformPlanRepository) {}

  async execute(changes: PlanChangeDto[]): Promise<number> {
    if (changes.length === 0) return 0;
    assertValidPlanChanges(changes);
    return this.repository.applyChanges(changes);
  }
}
