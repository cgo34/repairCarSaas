import { IUserRepository } from '@/features/users/application/ports/repositories/IUserRepository';
import { SupabaseClient } from '@/shared/infrastructure/supabase/SupabaseClient';
import { UserDto } from '@/features/users/application/dtos/UserDto';
import { IClientProvider } from "@/shared/infrastructure/supabase/IClientProvider";
import { UserMapper } from '@/features/users/infrastructure/mappers/UserMapper';
import { UserApiModel } from '@/features/users/infrastructure/api/UserApiModel';

export class UserRepository implements IUserRepository {
  constructor(private clientProvider: IClientProvider<SupabaseClient>) {}

  async getUsers(): Promise<UserDto[]> {
    const { data, error } = await this.clientProvider.getClient()
      .from('users')
      .select(`
        *,
        quotes!quotes_technician_id_fkey(*)
      `)
      .returns<UserApiModel[]>();

    if (error)
      throw new Error('Error fetching users');
    
    return data.map(UserMapper.apiToDto);
  }

  async getUserById(id: string): Promise<UserDto | null> {
    const { data, error } = await this.clientProvider.getClient()
      .from('users')
      .select('*')
      .eq('id', id)
      .maybeSingle<UserApiModel>();

    if (error) throw new Error('Error fetching user by ID');

    return data ? UserMapper.apiToDto(data) : null;
  }
  
  async createUser(user: UserDto): Promise<UserDto> {
    const apiModel = UserMapper.dtoToApiInsert(user);

    const { data, error } = await this.clientProvider.getClient()
      .from('users')
      .insert(apiModel)
      .select('*')
      .maybeSingle<UserApiModel>();

    if (error) throw new Error('Error inserting user');
    if (!data) throw new Error('No data returned after insert');

    return UserMapper.apiToDto(data);
  }
  
  async updateUser(id: string, user: Partial<UserDto>): Promise<void> {
    const { id: _excluded, ...updateFields } = user as UserDto;
    const apiModel = UserMapper.dtoToApi(updateFields);

    // Si on modifie is_blocked, on passe par le RPC SECURITY DEFINER
    if (apiModel.is_blocked !== undefined) {
      const { error } = await this.clientProvider.getClient()
        .rpc('set_user_blocked', { target_user_id: id, blocked: apiModel.is_blocked });
      if (error) throw new Error(`Error updating user blocked status: ${error.message}`);

      // Mettre à jour les autres champs restants s'il y en a
      const { is_blocked: _, ...rest } = apiModel;
      if (Object.keys(rest).length === 0) return;

      const { error: err2 } = await this.clientProvider.getClient()
        .from('users')
        .update(rest)
        .eq('id', id);
      if (err2) throw new Error(`Error updating user: ${err2.message}`);
      return;
    }

    const { error } = await this.clientProvider.getClient()
      .from('users')
      .update(apiModel)
      .eq('id', id);
    if (error) throw new Error(`Error updating user: ${error.message}`);
  }

  async deleteUser(id: string): Promise<void> {
    const { error } = await this.clientProvider.getClient()
      .from('users')
      .delete()
      .eq('id', id);

    if (error) throw new Error('Error deleting user');
  }
}