import { UserRole } from '@/features/users/domain/enums/UserRole';

export type UserViewModel = {
  role?: UserRole;
  id: string;
  email: string;
  full_name: string;
  phone?: string | null;
  first_name?: string;
  last_name?: string;
  isBlocked?: boolean;
  percentageCommission?: number;
}