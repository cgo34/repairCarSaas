// TODO: (GCE) -> TO DELETE BUT FIRST NEED TO CHECK IF IT'S USED IN THE PROJECT
import { IClient } from '@/@infrastructure/interfaces/IClient';
import { IClientProvider } from '@/@infrastructure/interfaces/IClientProvider';

export abstract class ClientProvider<TClient extends IClient> implements IClientProvider<TClient> {
  protected abstract client: TClient;

  getClient(): TClient {
    return this.client;
  }

  // abstract get auth(): any;
}