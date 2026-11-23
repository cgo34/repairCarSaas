export type AuthenticatedUserDto = {
  id: string;
  email: string;
  fullName: string;
  firstName: string;
  lastName: string;

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