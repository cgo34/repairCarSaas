import type { PlanChangeLogDto } from '@/features/platformAdmin/application/dtos/PlatformPlanDto';
import type { IPlatformPlanRepository } from '@/features/platformAdmin/application/ports/repositories/IPlatformPlanRepository';

export interface IListPlanChangeLogUseCase {
  execute(limit?: number): Promise<PlanChangeLogDto[]>;
}

export class ListPlanChangeLogUseCase implements IListPlanChangeLogUseCase {
  constructor(private readonly repository: IPlatformPlanRepository) {}

  execute(limit = 50): Promise<PlanChangeLogDto[]> {
    return this.repository.listChangeLog(limit);
  }
}
