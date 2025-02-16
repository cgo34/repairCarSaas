import { SupabaseClient as SupabaseSDK } from '@supabase/supabase-js';

export interface IClient {
  from<T>(table: string): ReturnType<SupabaseSDK['from']>;
  fromSchema<T>(schema: string, table: string): ReturnType<SupabaseSDK['from']>;
  auth: {
    signIn(email: string, password: string): Promise<unknown>;
    signUp(email: string, password: string): Promise<unknown>;
    signOut(): Promise<unknown>;
    onAuthStateChange(callback: (event: string, session: any) => void): void;
  };
  storage: SupabaseSDK['storage'];
}