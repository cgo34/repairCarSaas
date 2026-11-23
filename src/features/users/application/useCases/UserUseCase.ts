import { IUserService } from '@/features/users/application/ports/services/IUserService';
import { UserDto } from '@/features/users/application/dtos/UserDto';

export interface IUserUseCase {
  getUsers(): Promise<UserDto[]>;
  getUserById(id: string): Promise<UserDto | null>;
  createUser(user: UserDto): Promise<UserDto>;
  updateUser(id: string, user: Partial<UserDto>): Promise<void>;
  deleteUser(id: string): Promise<void>;
}

export class UserUseCase implements IUserUseCase {
  constructor(
    private readonly userService: IUserService
  ) {}

  async getUsers(): Promise<UserDto[]> {
    return this.userService.getUsers();
  }

  async getUserById(id: string): Promise<UserDto | null> {
    return this.userService.getUserById(id);
  }

  async createUser(user: UserDto): Promise<UserDto> {
    return this.userService.createUser(user);
  }

  async updateUser(id: string, user: Partial<UserDto>): Promise<void> {
    return this.userService.updateUser(id, user);
  }

  async deleteUser(id: string): Promise<void> {
    return this.userService.deleteUser(id);
  }
}
