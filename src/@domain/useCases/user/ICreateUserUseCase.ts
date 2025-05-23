import { UserDto } from '@/@infrastructure/dtos/UserDto';

export interface ICreateUserUseCase {
  execute(user: UserDto): Promise<void>;
}
