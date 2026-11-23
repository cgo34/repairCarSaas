import { SupabaseClient as SupabaseClientType } from '@supabase/supabase-js';

export interface ISupabaseClient {
  from: SupabaseClientType['from'];
  auth: SupabaseClientType['auth'];
  storage: SupabaseClientType['storage'];
}
