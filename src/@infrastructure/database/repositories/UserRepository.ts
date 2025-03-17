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
      .fromSchema<'public', 'users'>('public', 'users')
      .select('*')
      .returns<UserApiModel[]>();

    if (error)
      throw new Error('Error fetching users');

    return data.map(UserMapper.apiToDto);
  }

}