export interface OrganizationProfileRequiredFields {
  company_name?: string | null;
  legal_form?: string | null;
  address?: string | null;
  zip_code?: string | null;
  city?: string | null;
  payment_delay?: number | null;
}

const isFilled = (value: unknown): boolean => value !== '' && value !== null && value !== undefined;

// Mirrors the mandatory fields of the organization profile form
export function isOrganizationProfileComplete(profile: OrganizationProfileRequiredFields | null): boolean {
  if (!profile) return false;
  return [
    profile.company_name,
    profile.legal_form,
    profile.address,
    profile.zip_code,
    profile.city,
    profile.payment_delay,
  ].every(isFilled);
}
