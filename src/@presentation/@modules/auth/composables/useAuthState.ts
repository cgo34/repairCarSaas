import { SubscriptionDto } from '@/@application/dtos/SubscriptionDto';
import { ISubscriptionState } from '@/@application/states/interfaces/ISubscriptionState';
import { User } from '@domain/entities/User';
import { AuthError } from '@domain/errors/AuthError';
import { IAuthState } from '@domain/states/IAuthState';
import { container } from '@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@infrastructure/ioc/symbols';
import { computed, onUnmounted, ref } from 'vue';

const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);
const subscriptionState = container.get<ISubscriptionState>(SYMBOLS.States.SubscriptionState);
// Formulaire spécifique à l'authentification
const user = ref<User | undefined>(authState.user.value);
const error = ref<AuthError | null>(null);
const loading = ref(false);
const subcription = ref<SubscriptionDto>()

export function useAuthState() {

  const login = async () => {
    loading.value = true;
    error.value = null;

    if (!user.value?.email)
      return new Error('Email is required');

    if (!user.value.password)
      return new Error('Password is required');
    
    try {
      user.value = await authState.login(user.value?.email, user.value?.password);
    } catch (e) {
      error.value = e as AuthError;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const register = async () => {
    if (!user.value?.email)
        return new Error('Email is required');

    if (!user.value.password)
       return new Error('Password is required');

    if (!user.value.fullName)
        return new Error('Full name is required');

    await authState.register(user.value.email, user.value?.password, user.value.fullName);
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

  // Observer l'état
  const unsubscribe = authState.subscribe((state) => {
    if (!state.isAuthenticated)
      return
    
    subscriptionState.load(state.user.id).then((data) => {
      subcription.value = data
    })
  });

  // Nettoyage à la destruction du composant
  onUnmounted(() => {
    unsubscribe();
  });

  return {
    error,
    loading,
    login,
    register,
    logout,
    user,
    subcription: computed(() => subcription.value),
    isAuthenticated: ref<boolean>(authState.isAuthenticated.value)
  };
}
