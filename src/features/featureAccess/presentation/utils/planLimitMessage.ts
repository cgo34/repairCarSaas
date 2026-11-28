import { PlanLimitError } from '@/features/featureAccess/domain/errors/PlanLimitError';

type Translate = (key: string, params?: Record<string, unknown>) => string;

// Friendly message for a quota error, or null when the error is something else
export function planLimitMessage(error: unknown, t: Translate): string | null {
  if (!(error instanceof PlanLimitError)) return null;
  return error.limit === null
    ? t(`common.planLimit.${error.kind}Reached`)
    : t(`common.planLimit.${error.kind}`, { limit: error.limit });
}
