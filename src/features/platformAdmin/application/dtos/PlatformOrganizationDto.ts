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
  membersLimit: number | null;
  garagesLimit: number | null;
  quotesLimit: number | null;
  invoicesLimit: number | null;
  quotesMonthCount: number;
  invoicesMonthCount: number;
}
