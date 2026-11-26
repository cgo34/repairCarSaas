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
  
  async updateUser(id: string, user: Partial<UserDto>): Promise<void> {
    const { id: _excluded, ...updateFields } = user as UserDto;
    const apiModel = UserMapper.dtoToApi(updateFields);

    // Le RPC n'est appelé que si le statut bloqué change réellement
    // (un formulaire de profil renvoie is_blocked inchangé, et le RPC refuse l'auto-blocage)
    if (apiModel.is_blocked !== undefined) {
      const current = await this.getUserById(id);
      if (current && current.isBlocked === apiModel.is_blocked) {
        delete apiModel.is_blocked;
      }
    }

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