export type UserViewModel = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: 'technician' | 'manager' | 'admin';
  percentageCommission?: number;
}