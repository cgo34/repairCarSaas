import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { IUserUseCase } from '@/features/users/application/useCases/UserUseCase';
import { UserMapper } from '@/features/users/presentation/mappers/UserMapper';
import { IUseUserState } from '@/features/users/presentation/types/IUseUserState';
import { UserViewModel } from '@/features/users/presentation/models/UserViewModel';
import { computed, ref } from 'vue';

export interface UseUserStateDependencies {
  authState: IAuthState;
  userUseCase: IUserUseCase;
}

export function createUseUserState(deps: UseUserStateDependencies): IUseUserState {
  const { userUseCase } = deps;

  const _users = ref<UserViewModel[]>([]);
  const _selectedUser = ref<UserViewModel>({
    id: '',
    email: '',
    full_name: '',
    role: 'technician',
    percentageCommission: 0,
  });
  const loading = ref<boolean>(false);
  const error = ref<unknown>(null);

  const init = async () => {
    return getUsers().then(() => {});
  };

  const getUsers = async (): Promise<UserViewModel[]> => {
    loading.value = true;
    try {
      return userUseCase.getUsers().then((data) => {
        _users.value = data.map(UserMapper.dtoToView);
        return _users.value;
      });
    } catch (e) {
      error.value = e;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const selectUser = (user: UserViewModel): void => {
    _selectedUser.value = { ...user };
  };

  const resetSelectedUser = (): void => {
    _selectedUser.value = {
      id: '',
      email: '',
      full_name: '',
      role: 'technician',
      percentageCommission: 0,
    };
  };

  const updateUser = async (user: UserViewModel): Promise<UserViewModel> => {
    loading.value = true;
    try {
      const dto = UserMapper.viewToDto(user);
      await userUseCase.updateUser(user.id, dto);
      _users.value = _users.value.map((u) => (u.id === user.id ? { ...user } : u));
      return { ...user };
    } finally {
      loading.value = false;
    }
  };

  const deleteUser = async (id: string) => {
    loading.value = true;
    try {
      return userUseCase.deleteUser(id).then(() => {
        _users.value = _users.value.filter((u) => u.id !== id);
      });
    } finally {
      loading.value = false;
    }
  };

  return {
    users: computed(() => _users.value),
    selectedUser: computed(() => _selectedUser.value),
    loading,
    error,
    init,
    getUsers,
    selectUser,
    updateUser,
    deleteUser,
    resetSelectedUser,
  };
}
