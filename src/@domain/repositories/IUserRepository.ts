import { UserDto } from "@/@infrastructure/dtos/UserDto";

export interface IUserRepository {
  getUsers(): Promise<UserDto[]>;
  createUser(user: UserDto): Promise<UserDto>;
  updateUser(id: string, user: Partial<UserDto>): Promise<void>;
}
