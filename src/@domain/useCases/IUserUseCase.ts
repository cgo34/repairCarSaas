import { UserDto } from "@/@application/dtos/UserDto";

export interface IUserUseCase {
  getUsers(): Promise<UserDto[]>;
  getUserById(id: string): Promise<UserDto | null>;
  updateUser(id: string, user: Partial<UserDto>): Promise<void>;
}
