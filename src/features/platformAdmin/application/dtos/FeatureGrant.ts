export type FeatureGrantDuration = 'minutes5' | 'week' | 'month' | 'unlimited';

export const FEATURE_GRANT_DURATIONS: readonly FeatureGrantDuration[] = ['minutes5', 'week', 'month', 'unlimited'];

// Boolean add-on features a super admin can offer
export type GrantableFeature = 'quote_email_sending' | 'invoice_email_sending' | 'car_view';

export const GRANTABLE_FEATURES: readonly GrantableFeature[] = ['quote_email_sending', 'invoice_email_sending', 'car_view'];
