import { UserDto } from "@/@application/dtos/UserDto";

export interface IUserService {
  getUsers(): Promise<UserDto[]>;
  getUserById(id: string): Promise<UserDto | null>;
  createUser(user: UserDto): Promise<UserDto>;
  updateUser(id: string, user: Partial<UserDto>): Promise<void>;
  deleteUser(id: string): Promise<void>;
}