import { ClientProvider } from '@/@infrastructure/providers/ClientProvider';
import { SupabaseClient } from '@infrastructure/database/clients/SupabaseClient';
import { injectable } from 'inversify';

@injectable()
export class SupabaseClientProvider extends ClientProvider {
  protected client: SupabaseClient;

  constructor() {
    super();
    this.client = new SupabaseClient();
  }
}