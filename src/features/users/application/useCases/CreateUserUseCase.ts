import { IUserRepository } from '@/features/users/application/ports/repositories/IUserRepository';
import { UserDto } from '@/features/users/application/dtos/UserDto';

export interface ICreateUserUseCase {
  execute(user: UserDto): Promise<void>;
}

export class CreateUserUseCase implements ICreateUserUseCase {
  constructor(
    private userRepository: IUserRepository
  ) {}

  async execute(user: UserDto): Promise<void> {
    await this.userRepository.createUser(user);
  }
}
