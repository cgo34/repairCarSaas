import { CompanySettingsDto } from '@/features/account/application/dtos/CompanySettingsDto';
import { ICompanySettingsRepository } from '@/features/account/application/ports/repositories/ICompanySettingsRepository';
import { CompanySettingsApiModel } from '@/features/account/infrastructure/api/CompanySettingsApiModel';
import { CompanySettingsMapper } from '@/features/account/infrastructure/mappers/CompanySettingsMapper';
import { IClientProvider } from '@/shared/infrastructure/supabase/IClientProvider';
import { SupabaseClient } from '@/shared/infrastructure/supabase/SupabaseClient';

export class CompanySettingsRepository implements ICompanySettingsRepository {
  constructor(
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
