import { UserDto } from "@/@infrastructure/dtos/UserDto";

export interface IUserUseCase {
  getUsers(): Promise<UserDto[]>;
  updateUser(id: string, user: Partial<UserDto>): Promise<void>;
}
