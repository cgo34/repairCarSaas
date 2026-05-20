import { AuthenticatedUserDto } from '@/@application/dtos/AuthenticatedUserDto';
import { AuthError } from '@domain/errors/AuthError';
import { IAuthState } from '@domain/states/IAuthState';
import { container } from '@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@infrastructure/ioc/symbols';
import { computed, ref } from 'vue';

const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);

// ─────────────────────────────────────────────────────────────
// FORM LOGIN UNIQUEMENT
// NE PAS utiliser userContext ici
// ─────────────────────────────────────────────────────────────
const form = ref({
  email: '',
  password: '',
  fullName: '',
});

const error = ref<AuthError | null>(null);
const loading = ref(false);

export function useAuthState() {

  const login = async () => {
    loading.value = true;
    error.value = null;

    try {
      const user = await authState.login(
        form.value.email,
        form.value.password
      );

    } catch (e) {
      error.value = e as AuthError;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const register = async () => {
    loading.value = true;
    error.value = null;

    try {
      await authState.register(
        form.value.email,
        form.value.password,
        form.value.fullName
      );
    } catch (e) {
      error.value = e as AuthError;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    loading.value = true;
    error.value = null;

    try {
      await authState.logout();
    } catch (e) {
      error.value = e as AuthError;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    error,
    loading,

    login,
    register,
    logout,

    // FORM
    form,

    // AUTH CONTEXT
    userContext: computed(() => authState.userContext.value),

    isAuthenticated: computed(() => authState.isAuthenticated.value),
  };
}