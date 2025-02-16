import { IClient } from '@domain/clients/IClient';
import { Database } from '@infrastructure/database/database.types';
import { createClient } from '@supabase/supabase-js';
import { injectable } from 'inversify';

@injectable()
export class SupabaseClient implements IClient {
  private static instance: SupabaseClient;
  private readonly client = createClient<Database>(
    process.env.VITE_SUPABASE_URL as string,
    process.env.VITE_SUPABASE_KEY as string
  )

  constructor() {
    if (SupabaseClient.instance) {
      return SupabaseClient.instance;
    }

    SupabaseClient.instance = this;
  }

  from(table: string) {
    return this.client.from(table);
  }

  fromSchema<T extends keyof Database[keyof Database]['Tables'], R = unknown>(
    schema: keyof Database,
    table: T
  ) {
    return this.client.schema(schema).from<T, R>(table);
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