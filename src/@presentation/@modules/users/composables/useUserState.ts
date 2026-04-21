import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { IUserUseCase } from '@/@domain/useCases/IUserUseCase';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { UserMapper } from '@/@presentation/mappers/UserMapper';
import { IUseUserState } from '@/@presentation/types/composables/IUseUserState';
import { UserViewModel } from '@/@presentation/types/models/UserViewModel';
import { computed, ref } from 'vue';

export function useUserState(): IUseUserState {
  const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);
  const userUseCase = container.get<IUserUseCase>(SYMBOLS.UseCases.UserUseCase);

  const _users = ref<UserViewModel[]>([]);
  const _selectedUser = ref<UserViewModel>({
    id: '',
    email: '',
    fullName: '',
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
      fullName: '',
      role: 'technician',
      percentageCommission: 0,
    };
  };

  const addUser = async (user: UserViewModel) => {
    loading.value = true;
    try {
      return userUseCase.create(UserMapper.viewToDto(user)).then((data) => {
        const newUser = UserMapper.dtoToView(data);
        _users.value.push(newUser);
        resetSelectedUser();
        return newUser;
      });
    } finally {
      loading.value = false;
    }
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
      return userUseCase.delete(id).then(() => {
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
    addUser,
    updateUser,
    deleteUser,
    resetSelectedUser,
  };
}
