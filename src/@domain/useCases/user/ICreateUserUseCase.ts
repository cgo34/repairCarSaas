import { UserViewModel } from '@/@presentation/types/models/UserViewModel';

export interface ICreateUserUseCase {
  execute(user: UserViewModel): Promise<void>;
}
