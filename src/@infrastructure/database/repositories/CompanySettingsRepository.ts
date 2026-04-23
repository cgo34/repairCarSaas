import { CompanySettingsDto } from '@/@application/dtos/CompanySettingsDto';
import { ICompanySettingsRepository } from '@/@domain/repositories/ICompanySettingsRepository';
import { CompanySettingsApiModel } from '@/@infrastructure/database/api/CompanySettingsApiModel';
import { CompanySettingsMapper } from '@/@infrastructure/mappers/CompanySettingsMapper';
import { IClientProvider } from '@/@infrastructure/interfaces/IClientProvider';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';
import { SupabaseClient } from '../clients/SupabaseClient';

@injectable()
export class CompanySettingsRepository implements ICompanySettingsRepository {
  constructor(
    @inject(SYMBOLS.Providers.ClientProvider)
    private readonly clientProvider: IClientProvider<SupabaseClient>
  ) {}

  async getByUserId(userId: string): Promise<CompanySettingsDto | null> {
    const { data, error } = await this.clientProvider
      .getClient()
      .from('company_settings')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle<CompanySettingsApiModel>();

    if (error) throw new Error('Error fetching company settings');
    if (!data) return null;
    return CompanySettingsMapper.apiToDto(data);
  }

  async create(dto: CompanySettingsDto): Promise<CompanySettingsDto> {
    const api = CompanySettingsMapper.dtoToApi(dto);
    const { data, error } = await this.clientProvider
      .getClient()
      .from('company_settings')
      .insert(api)
      .select('*')
      .single<CompanySettingsApiModel>();

    if (error) throw new Error('Error creating company settings');
    return CompanySettingsMapper.apiToDto(data);
  }

  async update(dto: CompanySettingsDto): Promise<CompanySettingsDto> {
    const api = CompanySettingsMapper.dtoToApi(dto);
    const { data, error } = await this.clientProvider
      .getClient()
      .from('company_settings')
      .update(api)
      .eq('id', dto.id!)
      .select('*')
      .single<CompanySettingsApiModel>();

    if (error) throw new Error('Error updating company settings');
    return CompanySettingsMapper.apiToDto(data);
  }
}
