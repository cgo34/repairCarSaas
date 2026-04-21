import { UserDto } from "@/@infrastructure/dtos/UserDto";

export interface IUserService {
  getUsers(): Promise<UserDto[]>;
  updateUser(id: string, user: Partial<UserDto>): Promise<void>;
}