
import { inject, injectable } from "inversify";
import { IClientProvider } from "@infrastructure/interfaces/IClientProvider";
import { SupabaseClient } from "@infrastructure/database/clients/SupabaseClient";
import { SYMBOLS } from "@infrastructure/ioc/symbols";
import { OrganizationMemberDtoModel } from "@application/dtos/OrganizationMemberDtoModel";
import { OrganizationMemberApiModel } from "@infrastructure/database/api/OrganizationMemberApiModel";
import { OrganizationMemberMapper } from "@infrastructure/mappers/OrganizationMemberMapper";

@injectable()
export class OrganizationMemberRepository {
  constructor(
    @inject(SYMBOLS.Providers.ClientProvider)
    private readonly clientProvider: IClientProvider<SupabaseClient>
  ) {}

  async create(member: OrganizationMemberDtoModel): Promise<OrganizationMemberDtoModel> {
    console.log('Creating organization member:', member);
    const api = OrganizationMemberMapper.dtoToApi(member);
    const { data, error } = await this.clientProvider
      .getClient()
      .from('organization_members')
      .insert(api)
      .select('*')
      .single<OrganizationMemberApiModel>();

    if (error) throw new Error('Error creating organization member');
    return OrganizationMemberMapper.apiToDto(data);
  }
}
