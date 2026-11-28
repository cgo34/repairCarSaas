import type {
  PlanChangeDto,
  PlanChangeImpactDto,
  PlanChangeLogDto,
  PlatformPlanDto,
} from '@/features/platformAdmin/application/dtos/PlatformPlanDto';

export interface IPlatformPlanRepository {
  list(): Promise<PlatformPlanDto[]>;
  previewChanges(changes: PlanChangeDto[]): Promise<PlanChangeImpactDto[]>;
  applyChanges(changes: PlanChangeDto[]): Promise<number>;
  listChangeLog(limit?: number): Promise<PlanChangeLogDto[]>;
}
