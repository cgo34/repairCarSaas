import { IUserService } from '@/@domain/services/IUserService';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';
import { IUserUseCase } from '../interfaces/IUserUseCase';

@injectable()
export class UserUseCase implements IUserUseCase {
  constructor(
    @inject(SYMBOLS.Services.UserService)
    private readonly userService: IUserService
  ) {}

  async getUsers() {
    return await this.userService.getUsers();
  }
}
