export interface User {
    id?: string;
    email: string;
    password?: string;
    fullName?: string;
    role?: 'admin' | 'technician' | 'garage' | 'user';
    createdAt?: string;
  }
  