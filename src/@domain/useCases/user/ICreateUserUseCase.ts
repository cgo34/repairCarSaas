import { UserDto } from '@/@application/dtos/UserDto';

export interface ICreateUserUseCase {
  execute(user: UserDto): Promise<void>;
}
