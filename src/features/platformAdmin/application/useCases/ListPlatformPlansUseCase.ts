import type { PlatformPlanDto } from '@/features/platformAdmin/application/dtos/PlatformPlanDto';
import type { IPlatformPlanRepository } from '@/features/platformAdmin/application/ports/repositories/IPlatformPlanRepository';

export interface IListPlatformPlansUseCase {
  execute(): Promise<PlatformPlanDto[]>;
}

export class ListPlatformPlansUseCase implements IListPlatformPlansUseCase {
  constructor(private readonly repository: IPlatformPlanRepository) {}

  execute(): Promise<PlatformPlanDto[]> {
    return this.repository.list();
  }
}
