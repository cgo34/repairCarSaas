import { UserDto } from "@/@infrastructure/dtos/UserDto";

export interface IUserUseCase {
  getUsers(): Promise<UserDto[]>;
}
