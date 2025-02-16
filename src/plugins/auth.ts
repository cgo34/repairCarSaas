import { IAuthProvider } from '@domain/providers/IAuthProvider';
import { IAuthState } from '@domain/states/IAuthState';
import { container } from '@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@infrastructure/ioc/symbols';

export async function initAuth() {
  try {
    const authProvider = container.get<IAuthProvider>(SYMBOLS.Providers.ClientProvider);
    const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);

    // Configurer l'écouteur d'état d'authentification
    authProvider.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      if (event === 'SIGNED_IN' && session?.user) {
        authState.user.value = session.user;
        authState.isAuthenticated.value = true;
      } else if (event === 'SIGNED_OUT') {
        authState.user.value = undefined;
        authState.isAuthenticated.value = false;
      }
    });

    return true;
  } catch (error) {
    console.error('Failed to initialize auth:', error);
    return false;
  }
}