import { ComputedRef, Ref } from 'vue';
import { UserViewModel } from '@/features/users/presentation/models/UserViewModel';

export interface IUseProfileState {
  profile: ComputedRef<UserViewModel | null>;
  loading: Ref<boolean>;
  error: Ref<unknown>;
  init(userId: string): Promise<void>;
  save(vm: Partial<UserViewModel>): Promise<void>;
}
