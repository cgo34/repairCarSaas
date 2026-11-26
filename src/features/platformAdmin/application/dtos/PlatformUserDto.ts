export interface PlatformUserDto {
  id: string;
  fullName: string | null;
  email: string;
  isBlocked: boolean;
  role: string;
  organizationName: string;
  organizationsCount: number;
  createdAt: string | null;
}
