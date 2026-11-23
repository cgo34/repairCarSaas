import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';
import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { IClientProvider } from '@/shared/infrastructure/supabase/IClientProvider';
import { SupabaseClient } from '@/shared/infrastructure/supabase/SupabaseClient';

export function useAuthGuardDependencies() {
  return {
    authState: container.get<IAuthState>(SYMBOLS.States.AuthState),
  };
}

export function useLogoutRouteDependencies() {
  return {
    clientProvider: container.get<IClientProvider<SupabaseClient>>(SYMBOLS.Providers.ClientProvider),
    authState: container.get<IAuthState>(SYMBOLS.States.AuthState),
  };
}
