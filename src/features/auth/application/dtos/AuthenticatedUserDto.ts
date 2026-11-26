import { PlatformRole } from '@/features/users/domain/enums/PlatformRole';

export type AuthenticatedUserDto = {
  id: string;
  email: string;
  fullName: string;
  firstName: string;
  lastName: string;

  /** Global platform role, independent from any organization. */
  platformRole: PlatformRole;
  /** True for a super_admin with no active demo profile: no organization scope. */
  isGlobalContext: boolean;

  organization: {
    id: string;
    name: string;
    ownerUserId?: string;
  };

  membership: {
    id: string;
    percentage_commission: number;
    status: 'active' | 'pending' | 'blocked' | 'archived';
    role: 'admin' | 'technician' | 'manager';
  };

  subscription: {
    id: string;
    plan: string;
    status: string;
  };
}