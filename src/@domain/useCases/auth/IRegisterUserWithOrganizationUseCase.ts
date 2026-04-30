import { UserDto } from '@/@application/dtos/UserDto';

export interface IRegisterUserWithOrganizationUseCase {
  execute(email: string, password: string, fullName: string): Promise<UserDto>;
}
