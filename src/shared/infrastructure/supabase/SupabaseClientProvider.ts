import { ClientProvider } from '@/shared/infrastructure/supabase/ClientProvider';
import { SupabaseClient } from '@/shared/infrastructure/supabase/SupabaseClient';

export class SupabaseClientProvider extends ClientProvider<SupabaseClient> {
  protected client: SupabaseClient;

  constructor(client: SupabaseClient) {
    super();
    this.client = client; // Injection via Inversify
  }

  // get auth() {
  //   return this.client.auth;
  // }
}