import type { FeatureKey, FeatureValue } from '@/features/featureAccess/domain/types/FeatureKey'

export class OrganizationFeatures {
  constructor(private readonly values: Partial<Record<FeatureKey, FeatureValue>> = {}) {}

  static empty(): OrganizationFeatures {
    return new OrganizationFeatures()
  }

  // Default deny: an unknown or non-boolean feature is not granted
  can(key: FeatureKey): boolean {
    return this.values[key] === true
  }

  // null means unlimited; an absent limit means nothing is allowed
  limitOf(key: FeatureKey): number | null {
    const value = this.values[key]
    if (value === null) return null
    return typeof value === 'number' ? value : 0
  }

  isLimitReached(key: FeatureKey, usage: number): boolean {
    const limit = this.limitOf(key)
    return limit !== null && usage >= limit
  }

  remaining(key: FeatureKey, usage: number): number | null {
    const limit = this.limitOf(key)
    return limit === null ? null : Math.max(0, limit - usage)
  }
}
