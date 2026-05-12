export const organizationMemberStatusApiTypes = {
  pending: 'pending',
  active: 'active',
  archived: 'archived',
  blocked: 'blocked'
} as const;

export type OrganizationMemberStatusApiTypes = typeof organizationMemberStatusApiTypes[keyof typeof organizationMemberStatusApiTypes];