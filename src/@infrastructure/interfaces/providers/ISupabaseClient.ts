import { SupabaseClient as SupabaseClientType } from '@supabase/supabase-js';

export interface ISupabaseClient {
  from: (table: string) => any;
  auth: SupabaseClientType['auth'];
  storage: SupabaseClientType['storage'];
}
