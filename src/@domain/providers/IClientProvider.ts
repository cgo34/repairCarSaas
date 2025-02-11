import { IClient } from '@domain/clients/IClient';

export interface IClientProvider {
  getClient(): IClient;
}