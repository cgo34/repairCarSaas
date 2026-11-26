export interface RecentOrganizationDto {
  id: string;
  name: string;
  plan: string | null;
  createdAt: string | null;
  membersCount: number;
  garagesCount: number;
}

export interface MonthlySignupDto {
  month: string;
  count: number;
}

export interface PlatformStatsDto {
  organizationsTotal: number;
  freeOrganizations: number;
  premiumOrganizations: number;
  newOrganizations30d: number;
  usersTotal: number;
  newUsers30d: number;
  blockedUsers: number;
  mrrCents: number;
  quotesTotal: number;
  invoicesTotal: number;
  signups6m: MonthlySignupDto[];
  nearQuotaOrganizations: number;
  expiringSubscriptions: number;
  recentOrganizations: RecentOrganizationDto[];
}
