import { UserDto } from "@/features/users/application/dtos/UserDto";

export interface IUserService {
  getUsers(): Promise<UserDto[]>;
  getUserById(id: string): Promise<UserDto | null>;
  updateUser(id: string, user: Partial<UserDto>): Promise<void>;
  deleteUser(id: string): Promise<void>;
}