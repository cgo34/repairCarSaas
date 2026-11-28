import type { PlanChangeDto } from '@/features/platformAdmin/application/dtos/PlatformPlanDto';

export function assertValidPlanChanges(changes: PlanChangeDto[]): void {
  for (const change of changes) {
    if (typeof change.value === 'number' && (!Number.isInteger(change.value) || change.value < 0)) {
      throw new Error('INVALID_LIMIT');
    }
  }
}
