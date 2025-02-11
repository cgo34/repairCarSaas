import { UserRole } from '@domain/enums/UserRole';

export interface User {
  id: string;
  email: string;
  password?: string;
  fullName?: string;
  role: UserRole;
  createdAt: Date;
}