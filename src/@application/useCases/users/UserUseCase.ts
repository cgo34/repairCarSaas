import { IUserService } from '@/@domain/services/IUserService';
import { UserDto } from '@/@application/dtos/UserDto';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';
import { IUserUseCase } from '../../../@domain/useCases/IUserUseCase';

@injectable()
export class UserUseCase implements IUserUseCase {
  constructor(
    @inject(SYMBOLS.Services.UserService)
    private readonly userService: IUserService
  ) {}

  async getUsers(): Promise<UserDto[]> {
    return this.userService.getUsers();
  }

  async updateUser(id: string, user: Partial<UserDto>): Promise<void> {
    return this.userService.updateUser(id, user);
  }
}
