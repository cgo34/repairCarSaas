import { IClientProvider } from '@/shared/infrastructure/supabase/IClientProvider';
import { SupabaseClient } from '@/shared/infrastructure/supabase/SupabaseClient';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';

export function useResetPasswordPageDependencies() {
  return {
    clientProvider: container.get<IClientProvider<SupabaseClient>>(SYMBOLS.Providers.ClientProvider),
  };
}
