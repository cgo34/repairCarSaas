import { UserDto } from '@/@application/dtos/UserDto';
import { IUserRepository } from '@/@domain/repositories/IUserRepository';
import { IUserService } from '@/@domain/services/IUserService';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(SYMBOLS.Repositories.UserRepository)
    private readonly userRepository: IUserRepository
  ) {}

  async getUsers(): Promise<UserDto[]> {
    return await this.userRepository.getUsers();
  }
}
