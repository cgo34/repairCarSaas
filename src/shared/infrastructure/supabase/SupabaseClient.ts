import { getRuntimeConfig } from '@/shared/infrastructure/config/RuntimeConfig';
import { IClient } from '@/shared/infrastructure/supabase/IClient';
import { Database } from '@/shared/infrastructure/supabase/database.types';
import { SupabaseClient as BaseSupabaseClient, createClient } from '@supabase/supabase-js';

// // export class SupabaseClient implements IClient {
//   private client: BaseSupabaseClient<Database>;

//   constructor() {
//     this.client = createClient<Database>(
//       process.env.VITE_SUPABASE_URL as string,
//       process.env.VITE_SUPABASE_KEY as string,
//       { db: { schema: 'public' } }
//     );
//   }

//   rpc<T = any>(fn: string, params?: Record<string, any>) {
//     return this.client.rpc<T>(fn, params);
//   }
  
  
//   // Proxy methods to the underlying client
//   from<T extends keyof Database['public']['Tables']>(table: T) {
//     return this.client.from(table);
//   }

//   fromSchema<
//     S extends keyof Database,
//     T extends Extract<keyof Database[S]['Tables'], string>
//   >(schema: S, table: T) {
//     return this.client.schema(schema).from(table);
//   }

//   // fromSchema<S extends keyof Database, T extends keyof Database[S]['Tables']>(
//   //   schema: S,
//   //   table: T
//   // ) {
//   //   return this.client
//   //     .from<Database[S]['Tables'][T]['Row'], Database[S]['Tables'][T]['Insert']>(table)
//   //     .schema(schema); // Forcer le schéma
//   // }

//   get auth() {
//     return {
//       signIn: (email: string, password: string) => this.client.auth.signInWithPassword({ email, password }),
//       signUp: (email: string, password: string, fullName: string) => this.client.auth.signUp({ email, password, options: { data: { fullName }} }),
//       signOut: () => this.client.auth.signOut(),
//       onAuthStateChange: (callback: (event: string, session: any) => void) => this.client.auth.onAuthStateChange(callback),
//       user: () => this.client.auth.getUser(),
//       session: () => this.client.auth.getSession(),
//       resetPasswordForEmail: (email: string, redirectTo?: string) =>
//         this.client.auth.resetPasswordForEmail(email, { redirectTo }), // 🔥 Ajout ici !
//       updateUser: (user: any) => this.client.auth.updateUser(user),
//     };
//   }

//   get storage() {
//     return this.client.storage;
//   }

//   get functions() {
//     return this.client.functions;
//   }
// }

export class SupabaseClient implements IClient {
  private readonly client: BaseSupabaseClient<Database>;

  constructor() {
    const { supabase } = getRuntimeConfig();
    this.client = createClient<Database>(
      supabase.url,
      supabase.publishableKey,
      {
        db: {
          schema: 'public'
        },
        auth: {
          persistSession: true,
          detectSessionInUrl: true,
          storage: localStorage
        }
      }
    );
  }

  get instance() {
    return this.client;
  }

  get auth() {
    return this.client.auth;
  }

  get functions() {
    return this.client.functions;
  }

  from<T extends keyof Database['public']['Tables']>(table: T) {
    return this.client.from(table);
  }

  fromView<T extends keyof Database['public']['Views']>(view: T) {
    return this.client.from(view);
  }

  rpc<FnName extends keyof Database['public']['Functions']>(
    fn: FnName,
    params?: Database['public']['Functions'][FnName]['Args'],
  ) {
    return this.client.rpc(fn, params);
  }
}
