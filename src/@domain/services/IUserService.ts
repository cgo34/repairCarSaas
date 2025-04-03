import { UserDto } from "@/@infrastructure/dtos/UserDto";

export interface IUserService {
  getUsers(): Promise<UserDto[]>;
}