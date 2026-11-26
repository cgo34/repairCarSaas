import { UserViewModel } from '@/features/users/presentation/models/UserViewModel';
import { ComputedRef, Ref } from 'vue';

export interface IUseUserState {
  users: ComputedRef<UserViewModel[]>;
  selectedUser: ComputedRef<UserViewModel>;
  loading: Ref<boolean>;
  error: Ref<unknown>;

  init(): Promise<void>;
  getUsers(): Promise<UserViewModel[]>;

  selectUser(user: UserViewModel): void;
  resetSelectedUser(): void;
  updateUser(user: UserViewModel): Promise<UserViewModel>;
  deleteUser(id: string): Promise<void>;
}
