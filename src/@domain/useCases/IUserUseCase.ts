import { UserViewModel } from "@/@presentation/types/models/UserViewModel";

export interface IUserUseCase {
  getUsers(): Promise<UserViewModel[]>;
}
