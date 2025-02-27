import { UserDto } from "@/@application/dtos/UserDto";

export interface IUserRepository {
  getAll(): Promise<UserDto[]>;
  // getById(id: string): Promise<User | null>;
  // create(user: UserDto): Promise<UserDto>;
  // update(user: UserDto): Promise<UserDto>;
  // delete(id: string): Promise<void>;
}
