import { UserDto } from '@/features/users/application/dtos/UserDto';

export interface IAuthService {
    login(email: string, password: string): Promise<UserDto>;
    register(email: string, password: string, fullName: string): Promise<{ user: UserDto | null, error: Error | null }>;
    logout(): Promise<void>;
    getCurrentUser(): Promise<UserDto | null>;
    updateEmail(newEmail: string): Promise<void>;
    onAuthStateChange(callback: (event: string, session: unknown) => void): void;
  }
  