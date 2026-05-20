export type AuthenticatedUserDto = {
  id: string;
  email: string;

  organization: {
    id: string;
    name: string;
  };

  membership: {
    id: string;
    percentage_commission: number;
    status: 'active' | 'pending' | 'blocked' | 'archived';
    role: 'admin' | 'technician' | 'manager';
  };

  subscription: {
    plan: 'free' | 'premium';
    status: 'active';
  };
}