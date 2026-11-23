import { IClient } from "./IClient";

export interface IClientProvider<TClient extends IClient> {
  getClient(): TClient;
  // auth: any;
}