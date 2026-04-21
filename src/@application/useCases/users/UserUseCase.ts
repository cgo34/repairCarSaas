import { IUserService } from '@/@domain/services/IUserService';
import { UserDto } from '@/@infrastructure/dtos/UserDto';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';
import { IUserUseCase } from '../../../@domain/useCases/IUserUseCase';
import { UserMapper } from '@/@presentation/mappers/UserMapper';

@injectable()
export class UserUseCase implements IUserUseCase {
  constructor(
    @inject(SYMBOLS.Services.UserService)
    private readonly userService: IUserService
  ) {}

  async getUsers() {
    const dtos = await this.userService.getUsers();
    return dtos.map(UserMapper.dtoToView);
  }

  async updateUser(id: string, user: Partial<UserDto>): Promise<void> {
    return await this.userService.updateUser(id, user);
  }
}
