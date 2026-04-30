
import { inject, injectable } from "inversify";
import { IClientProvider } from "@infrastructure/interfaces/IClientProvider";
import { SupabaseClient } from "@infrastructure/database/clients/SupabaseClient";
import { SYMBOLS } from "@infrastructure/ioc/symbols";
import { OrganizationDtoModel } from "@application/dtos/OrganizationDtoModel";
import { OrganizationApiModel } from "@infrastructure/database/api/OrganizationApiModel";
import { OrganizationMapper } from "@infrastructure/mappers/OrganizationMapper";

@injectable()
export class OrganizationRepository {
  constructor(
    @inject(SYMBOLS.Providers.ClientProvider)
    private readonly clientProvider: IClientProvider<SupabaseClient>
  ) {}
  
  async getById(id: string): Promise<OrganizationDtoModel | null> {
    console.log('Fetching organization by ID:', id);
    const { data, error } = await this.clientProvider
      .getClient()
      .from('organizations')
      .select('*')
      .eq('id', id)
      .limit(1)
      .single<OrganizationApiModel>();

    if (error) {
      console.error('[OrganizationRepo] getById error:', error);
      return null;
    }

    console.log('Fetched organization by ID', id, ':', data);

    return OrganizationMapper.apiToDto(data);
  }

  async create(organization: OrganizationDtoModel): Promise<OrganizationDtoModel> {
    console.log('Creating organization:', organization);
    
    const api = OrganizationMapper.dtoToApi(organization);
    const { data, error } = await this.clientProvider
      .getClient()
      .from('organizations')
      .insert(api)
      .select('*')
      .single<OrganizationApiModel>();

    if (error) throw new Error('Error creating organization');
    return OrganizationMapper.apiToDto(data);
  }
}
