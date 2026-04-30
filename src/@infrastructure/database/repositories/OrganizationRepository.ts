
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
