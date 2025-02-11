import { IClient } from '@domain/clients/IClient';
import { createClient, SupabaseClient as SupabaseSDK } from '@supabase/supabase-js';
import { injectable } from 'inversify';

@injectable()
export class SupabaseClient implements IClient {
  private static instance: SupabaseClient;
  private readonly client: SupabaseSDK;

  constructor() {
    if (SupabaseClient.instance) {
      return SupabaseClient.instance;
    }

    const url = process.env.VITE_SUPABASE_URL;
    const key = process.env.VITE_SUPABASE_KEY;

    if (!url || !key) {
      throw new Error('Supabase URL and Key must be provided');
    }

    this.client = createClient(url, key);
    SupabaseClient.instance = this;
  }

  from(table: string) {
    return this.client.from(table);
  }

  get auth() {
    return {
      signIn: (email: string, password: string) => this.client.auth.signInWithPassword({ email, password }),
      signUp: (email: string, password: string) => this.client.auth.signUp({ email, password }),
      signOut: () => this.client.auth.signOut(),
      onAuthStateChange: (callback: (event: string, session: any) => void) => this.client.auth.onAuthStateChange(callback),
    };
  }

  get storage() {
    return this.client.storage;
  }
}