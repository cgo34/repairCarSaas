import type { PlanChangeDto, PlanChangeImpactDto } from '@/features/platformAdmin/application/dtos/PlatformPlanDto';
import type { IPlatformPlanRepository } from '@/features/platformAdmin/application/ports/repositories/IPlatformPlanRepository';
import { assertValidPlanChanges } from '@/features/platformAdmin/application/useCases/assertValidPlanChanges';

export interface IPreviewPlanChangesUseCase {
  execute(changes: PlanChangeDto[]): Promise<PlanChangeImpactDto[]>;
}

export class PreviewPlanChangesUseCase implements IPreviewPlanChangesUseCase {
  constructor(private readonly repository: IPlatformPlanRepository) {}

  async execute(changes: PlanChangeDto[]): Promise<PlanChangeImpactDto[]> {
    if (changes.length === 0) return [];
    assertValidPlanChanges(changes);
    return this.repository.previewChanges(changes);
  }
}
