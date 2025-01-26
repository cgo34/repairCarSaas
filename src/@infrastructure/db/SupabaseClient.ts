import { ISupabaseClient } from '@domain/providers/ISupabaseClient';
import { createClient, SupabaseClient as SupabaseClientType } from '@supabase/supabase-js';
import { injectable } from 'inversify';

@injectable()
export class SupabaseClient implements ISupabaseClient {
  private static instance: SupabaseClient;
  private readonly supabase: SupabaseClientType;

  constructor() {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase environment variables are missing');
    }

    if (SupabaseClient.instance) {
      return SupabaseClient.instance;
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
    SupabaseClient.instance = this;

    console.log('[SupabaseClient] Initialized with URL:', supabaseUrl);
  }

  from(table: string) {
    return this.supabase.from(table);
  }

  get auth() {
    return this.supabase.auth;
  }

  get storage() {
    return this.supabase.storage;
  }
}
