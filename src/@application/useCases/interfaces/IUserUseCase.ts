import { UserDto } from "@/@application/dtos/UserDto";

export interface IUserUseCase {
  getUsers(): Promise<UserDto[]>;
}
