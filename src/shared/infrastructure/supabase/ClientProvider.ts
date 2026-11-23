import { IClient } from '@/shared/infrastructure/supabase/IClient';
import { IClientProvider } from '@/shared/infrastructure/supabase/IClientProvider';


export abstract class ClientProvider<TClient extends IClient> implements IClientProvider<TClient> {
  protected abstract client: TClient;

  getClient(): TClient {
    return this.client;
  }

  // abstract auth() {
  //   // return this.client.auth; // Expose auth pour éviter l'erreur
  // }
}