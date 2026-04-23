import { UserDto } from "@/@application/dtos/UserDto";

export interface IUserService {
  getUsers(): Promise<UserDto[]>;
  getUserById(id: string): Promise<UserDto | null>;
  updateUser(id: string, user: Partial<UserDto>): Promise<void>;
}