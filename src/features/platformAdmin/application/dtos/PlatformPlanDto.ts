export type PlanFeatureValue = boolean | number | null;

export interface PlanFeatureDto {
  key: string;
  type: 'boolean' | 'limit';
  name: string;
  description: string | null;
  isAddon: boolean;
  value: PlanFeatureValue;
}

export interface PlatformPlanDto {
  id: string;
  code: string;
  name: string;
  priceCents: number;
  orgsCount: number;
  features: PlanFeatureDto[];
}

export interface PlanChangeDto {
  planId: string;
  featureKey: string;
  value: PlanFeatureValue;
}

export interface PlanChangeImpactDto {
  planId: string;
  planCode: string;
  featureKey: string;
  featureName: string;
  type: 'boolean' | 'limit';
  oldValue: PlanFeatureValue;
  newValue: PlanFeatureValue;
  orgsOnPlan: number;
  orgsAffected: number;
  isRisky: boolean;
}

export interface PlanChangeLogDto {
  id: string;
  changedAt: string;
  changedBy: string | null;
  planCode: string;
  featureKey: string;
  featureName: string;
  oldValue: PlanFeatureValue;
  newValue: PlanFeatureValue;
  orgsOnPlan: number;
  orgsAffected: number;
}
