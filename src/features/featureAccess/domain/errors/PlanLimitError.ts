export type PlanLimitKind = 'garages' | 'quotes' | 'invoices' | 'conversions';

const PLAN_LIMIT_PATTERN = /PLAN_LIMIT_(GARAGES|QUOTES|INVOICES|CONVERSIONS)\b(?::\s*limite de (\d+))?/;

// Raised when a database trigger refuses an insert because the plan quota is reached
export class PlanLimitError extends Error {
  constructor(
    public readonly kind: PlanLimitKind,
    public readonly limit: number | null,
  ) {
    super(`PLAN_LIMIT_${kind.toUpperCase()}`);
    this.name = 'PlanLimitError';
  }

  static from(error: { message?: string } | null | undefined): PlanLimitError | null {
    const match = error?.message?.match(PLAN_LIMIT_PATTERN);
    if (!match) return null;
    return new PlanLimitError(match[1].toLowerCase() as PlanLimitKind, match[2] ? Number(match[2]) : null);
  }
}
