import { IClient } from '@domain/clients/IClient';
import { IClientProvider } from '@domain/providers/IClientProvider';

export abstract class ClientProvider implements IClientProvider {
  protected abstract client: IClient;

  getClient(): IClient {
    return this.client;
  }
}