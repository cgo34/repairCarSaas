import { UserDto } from '@/@application/dtos/UserDto';
export interface IRegisterUseCase {
  execute(email: string, password: string, fullName: string): Promise<{ user: UserDto | null, error: any }>;
}