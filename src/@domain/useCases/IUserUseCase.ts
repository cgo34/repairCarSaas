import { UserDto } from "@/@application/dtos/UserDto";

export interface IUserUseCase {
  getUsers(): Promise<UserDto[]>;
  updateUser(id: string, user: Partial<UserDto>): Promise<void>;
}
