import { IClientProvider } from '@/@domain/providers/IClientProvider';
import { SupabaseClient } from '@infrastructure/database/clients/SupabaseClient';
import { injectable } from 'inversify';

@injectable()
export class SupabaseClientProvider implements IClientProvider {
  private client: SupabaseClient;

  constructor() {
    this.client = new SupabaseClient();
  }

  getClient() {
    return this.client.getClient();
  }
}