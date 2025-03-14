import { UserDto } from "@/@application/dtos/UserDto";

export interface IUserService {
  getUsers(): Promise<UserDto[]>;
}