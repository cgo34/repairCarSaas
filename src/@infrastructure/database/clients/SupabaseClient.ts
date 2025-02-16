import { IClient } from '@/@domain/clients/IClient';
import { Database } from '@infrastructure/database/database.types';
import { SupabaseClient as BaseSupabaseClient, createClient } from '@supabase/supabase-js';
import { injectable } from 'inversify';

@injectable()
export class SupabaseClient implements IClient {
  private client: BaseSupabaseClient<Database>;

  constructor() {
    this.client = createClient<Database>(
      process.env.VITE_SUPABASE_URL as string,
      process.env.VITE_SUPABASE_KEY as string
    );
  }

  // Retourne directement l'instance Supabase native
  getClient(): BaseSupabaseClient<Database> {
    return this.client;
  }
  
  // Proxy methods to the underlying client
  // from<T extends keyof Database['public']['Tables']>(table: T) {
  //   return this.client.from(table);
  // }

  // from(table) {
  //   return this.client.from(table);
  // }

  // fromSchema<S extends keyof Database, T extends keyof Database[S]['Tables']>(schema: S, table: T) {
  //   return this.client.from<T>(table).schema(schema);
  // }

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
