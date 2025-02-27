import { UserDto } from '@/@application/dtos/UserDto';
import { IUserRepository } from '@/@domain/repositories/IUserRepository';
import { SupabaseClient } from '@/@infrastructure/database/clients/SupabaseClient';
import { IClientProvider } from "@/@infrastructure/interfaces/IClientProvider";
import { SYMBOLS } from "@/@infrastructure/ioc/symbols";
import { inject, injectable } from "inversify";
import { UserApiModel } from '../api/UserApiModel';
import { UserMapper } from '@/@infrastructure/mappers/UserMapper';

@injectable()
export class UserRepository implements IUserRepository {
  constructor(@inject(SYMBOLS.Providers.ClientProvider) private clientProvider: IClientProvider<SupabaseClient>) {}

  async getAll(): Promise<UserDto[]> {
    const { data, error } = await this.clientProvider.getClient()
      .from('users')
      .select('*')
      .returns<UserApiModel[]>();

    if (error)
      throw new Error('Error fetching users');

    return data.map(UserMapper.apiToDto);
  }

}