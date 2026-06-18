import { IUserRepository } from '@/@domain/repositories/IUserRepository';
import { SupabaseClient } from '@/@infrastructure/database/clients/SupabaseClient';
import { UserDto } from '@/@application/dtos/UserDto';
import { IClientProvider } from "@/@infrastructure/interfaces/IClientProvider";
import { SYMBOLS } from "@/@infrastructure/ioc/symbols";
import { UserMapper } from '@/@infrastructure/mappers/UserMapper';
import { inject, injectable } from "inversify";
import { UserApiModel } from '../api/UserApiModel';

@injectable()
export class UserRepository implements IUserRepository {
  constructor(@inject(SYMBOLS.Providers.ClientProvider) private clientProvider: IClientProvider<SupabaseClient>) {}

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
    const apiModel = UserMapper.dtoToApi(user);

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
    // On exclut l'id du payload : ne jamais tenter de modifier la PK
    const { id: _excluded, ...updateFields } = user as UserDto;
    const apiModel = UserMapper.dtoToApi(updateFields);

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
  
  async ensureUserProfile(user: UserDto): Promise<void> {
    const { error } = await this.clientProvider.getClient()
      .rpc('ensure_user_profile', {
        user_id: user.id,
        email: user.email,
        full_name: user.fullName,
        role: user.role
      });
  
    if (error) throw new Error(`Error creating user profile: ${error.message}`);
  }
  

}