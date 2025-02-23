import { IClient } from '@/@infrastructure/interfaces/IClient';
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
  
  // Proxy methods to the underlying client
  from<T extends keyof Database['public']['Tables']>(table: T) {
    return this.client.from(table);
  }

  fromSchema<S extends keyof Database, T extends keyof Database[S]['Tables']>(schema: S, table: T) {
    return this.client.schema(schema).from(table);
  }

  // fromSchema<S extends keyof Database, T extends keyof Database[S]['Tables']>(
  //   schema: S,
  //   table: T
  // ) {
  //   return this.client
  //     .from<Database[S]['Tables'][T]['Row'], Database[S]['Tables'][T]['Insert']>(table)
  //     .schema(schema); // Forcer le schéma
  // }

  get auth() {
    return {
      signIn: (email: string, password: string) => this.client.auth.signInWithPassword({ email, password }),
      signUp: (email: string, password: string) => this.client.auth.signUp({ email, password }),
      signOut: () => this.client.auth.signOut(),
      onAuthStateChange: (callback: (event: string, session: any) => void) => this.client.auth.onAuthStateChange(callback),
      user: () => this.client.auth.getUser(),
      session: () => this.client.auth.getSession(),
    };
  }

  get storage() {
    return this.client.storage;
  }
}
