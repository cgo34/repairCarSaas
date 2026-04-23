import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { IAuthService } from '@/@domain/services/IAuthService';
import { IUserUseCase } from '@/@domain/useCases/IUserUseCase';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { UserMapper } from '@/@presentation/mappers/UserMapper';
import { IUseProfileState } from '@/@presentation/types/composables/IUseProfileState';
import { UserViewModel } from '@/@presentation/types/models/UserViewModel';
import { computed, ref } from 'vue';

export function useProfileState(): IUseProfileState {
  const authState   = container.get<IAuthState>(SYMBOLS.States.AuthState);
  const authService = container.get<IAuthService>(SYMBOLS.Services.AuthService);
  const userUseCase = container.get<IUserUseCase>(SYMBOLS.UseCases.UserUseCase);

  const _profile = ref<UserViewModel | null>(null);
  const loading  = ref<boolean>(false);
  const error    = ref<unknown>(null);

  const init = async (userId: string): Promise<void> => {
    loading.value = true;
    try {
      const dto = await userUseCase.getUserById(userId);
      _profile.value = dto
        ? UserMapper.dtoToView(dto)
        : {
            id: userId,
            email: authState.user.value?.email ?? '',
            fullName: authState.user.value?.fullName ?? '',
            firstName: '',
            lastName: '',
            role: authState.user.value?.role ?? 'user',
            percentageCommission: 0,
          };
    } catch (e) {
      error.value = e;
      _profile.value = {
        id: userId,
        email: authState.user.value?.email ?? '',
        fullName: authState.user.value?.fullName ?? '',
        firstName: '',
        lastName: '',
        role: authState.user.value?.role ?? 'user',
        percentageCommission: 0,
      };
    } finally {
      loading.value = false;
    }
  };

  const save = async (vm: Partial<UserViewModel>): Promise<void> => {
    loading.value = true;
    try {
      const id = authState.user.value?.id ?? _profile.value?.id;
      if (!id) throw new Error('No user id');

      const currentEmail = _profile.value?.email ?? authState.user.value?.email ?? '';
      const newEmail     = vm.email?.trim() ?? '';
      const emailChanged = newEmail && newEmail !== currentEmail;

      // 1. Si l'email a changé → mettre à jour auth.users via Supabase Auth
      if (emailChanged) {
        await authService.updateEmail(newEmail);
      }

      // 2. Toujours mettre à jour public.users (firstName, lastName, et email si changé)
      const dto = UserMapper.viewToDto({
        ..._profile.value!,
        ...vm,
        id,
        email: emailChanged ? newEmail : currentEmail,
      });
      await userUseCase.updateUser(id, dto);

      // 3. Mettre à jour le state local
      _profile.value = {
        ..._profile.value!,
        ...vm,
        id,
        email: emailChanged ? newEmail : currentEmail,
      };
    } catch (e) {
      error.value = e;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    profile: computed(() => _profile.value),
    loading,
    error,
    init,
    save,
  };
}
