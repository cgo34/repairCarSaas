export interface PlatformOrganizationDto {
  id: string;
  name: string;
  createdAt: string | null;
  planCode: string | null;
  subscriptionStatus: string | null;
  membersCount: number;
  garagesCount: number;
  quotesCount: number;
  invoicesCount: number;
  isDemo: boolean;
}
