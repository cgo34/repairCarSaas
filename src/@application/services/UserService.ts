import { User } from '@/@domain/entities/User';
import { supabase } from '@/@infrastructure/database/clients/SupabaseClient';

export class UserService {
  async getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase.from('users').select('*');
    if (error) throw new Error(error.message);
    return data;
  }

  async createUser(user: User) {
    const { error } = await supabase.from('users').insert(user);
    if (error) throw new Error(error.message);
  }
}
