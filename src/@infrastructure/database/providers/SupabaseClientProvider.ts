import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { ClientProvider } from '@/@infrastructure/providers/ClientProvider';
import { SupabaseClient } from '@infrastructure/database/clients/SupabaseClient';
import { inject, injectable } from 'inversify';

@injectable()
export class SupabaseClientProvider extends ClientProvider<SupabaseClient> {
  protected client: SupabaseClient;

  constructor(@inject(SYMBOLS.Clients.SupabaseClient) client: SupabaseClient) {
    super();
    this.client = client; // Injection via Inversify
  }

  // get auth() {
  //   return this.client.auth;
  // }
}