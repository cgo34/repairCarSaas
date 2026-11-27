export interface PlatformUserDto {
  id: string;
  fullName: string | null;
  email: string;
  isBlocked: boolean;
  role: string;
  organizationName: string | null;
  organizationsCount: number;
  createdAt: string | null;
  isDemo: boolean;
}
