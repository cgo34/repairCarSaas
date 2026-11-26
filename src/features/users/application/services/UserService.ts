import { IUserRepository } from '@/features/users/application/ports/repositories/IUserRepository';
import { IUserService } from '@/features/users/application/ports/services/IUserService';
import { UserDto } from '@/features/users/application/dtos/UserDto';

export class UserService implements IUserService {
  constructor(
    private readonly userRepository: IUserRepository
  ) {}

  async getUsers(): Promise<UserDto[]> {
    return await this.userRepository.getUsers();
  }

  async getUserById(id: string): Promise<UserDto | null> {
    return await this.userRepository.getUserById(id);
  }

  async updateUser(id: string, user: Partial<UserDto>): Promise<void> {
    return await this.userRepository.updateUser(id, user);
  }

  async deleteUser(id: string): Promise<void> {
    return await this.userRepository.deleteUser(id);
  }
}
