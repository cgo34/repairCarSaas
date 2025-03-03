import { UserDto } from "@/@application/dtos/UserDto";

export interface IUserRepository {
  getUsers(): Promise<UserDto[]>;
  // getById(id: string): Promise<User | null>;
  // create(user: UserDto): Promise<UserDto>;
  // update(user: UserDto): Promise<UserDto>;
  // delete(id: string): Promise<void>;
}
