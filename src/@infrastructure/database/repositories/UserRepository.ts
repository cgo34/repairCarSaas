import { IUserRepository } from '@/@domain/repositories/IUserRepository';
import { SupabaseClient } from '@/@infrastructure/database/clients/SupabaseClient';
import { UserDto } from '@/@infrastructure/dtos/UserDto';
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
        *
      `)
      .returns<UserApiModel[]>();

    if (error)
      throw new Error('Error fetching users');
    console.log('getUsers', data);
    
    return data.map(UserMapper.apiToDto);
  }

  async getUserById(id: string): Promise<UserDto | null> {
    const { data, error } = await this.clientProvider.getClient()
      .from('users')
      .select(`
        *
      `)
      .eq('id', id)
      .returns<UserApiModel>();
  
    if (error) throw new Error('Error fetching user by ID');
    console.log(data);
    
    return data ? UserMapper.apiToDto(data) : null;
  }
  
  async createUser(user: UserDto): Promise<void> {
    const apiModel = UserMapper.dtoToApi(user);
    console.log('createUser', apiModel);
    
    const { error } = await this.clientProvider.getClient()
      .from('users')
      .insert(apiModel);
  
    if (error) throw new Error('Error inserting user');
  }
  
  async updateUser(id: string, user: Partial<UserDto>): Promise<void> {
    const apiModel = UserMapper.dtoToApi(user);
  
    const { error } = await this.clientProvider.getClient()
      .fromSchema<'public', 'users'>('public', 'users')
      .update(apiModel)
      .eq('id', id);
  
    if (error) throw new Error('Error updating user');
  }
  
  async deleteUser(id: string): Promise<void> {
    const { error } = await this.clientProvider.getClient()
      .fromSchema<'public', 'users'>('public', 'users')
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