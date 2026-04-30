export type AuthenticatedUserDto = {
  id: string;
  email: string;

  organization: {
    id: string;
    name: string;
  };

  membership: {
    role: 'admin' | 'technician' | 'manager';
  };

  subscription: {
    plan: 'free' | 'premium';
    status: 'active';
  };
}