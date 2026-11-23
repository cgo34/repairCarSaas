
import { IClientProvider } from "@/shared/infrastructure/supabase/IClientProvider";
import { SupabaseClient } from "@/shared/infrastructure/supabase/SupabaseClient";
import { OrganizationDtoModel } from "@/features/organizations/application/dtos/OrganizationDtoModel";
import { OrganizationApiModel } from "@/features/organizations/infrastructure/api/OrganizationApiModel";
import { OrganizationMapper } from "@/features/organizations/infrastructure/mappers/OrganizationMapper";
import { IOrganizationRepository } from "@/features/organizations/application/ports/repositories/IOrganizationRepository";

export class OrganizationRepository implements IOrganizationRepository {
  constructor(
    private readonly clientProvider: IClientProvider<SupabaseClient>
  ) {}
  
  async getById(id: string): Promise<OrganizationDtoModel | null> {
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

    return OrganizationMapper.apiToDto(data);
  }

  async create(organization: OrganizationDtoModel): Promise<OrganizationDtoModel> {
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
