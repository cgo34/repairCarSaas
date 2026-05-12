
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

  async getByMemberId(userId: string): Promise<OrganizationMemberDtoModel[]> {
    console.log('Fetching organization members for user ID:', userId);
    const { data, error } = await this.clientProvider
      .getClient()
      .from('organization_members')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('[OrganizationMemberRepo] getByMemberId error:', error);
      return [];
    }

    console.log('Organization members for user', userId, ':', data);

    const dto = data.map(OrganizationMemberMapper.apiToDto);
    console.log('Mapped organization members DTOs for user', userId, ':', dto);
    return dto;
  }

  async getMembersByOrganizationId(organizationId: string): Promise<OrganizationMemberDtoModel[]> {
    const { data, error } = await this.clientProvider.getClient()
      .from('organization_members')
      .select(`*, users!organization_members_user_id_fkey(id, email, full_name, first_name, last_name)`)
      .eq('organization_id', organizationId)
      .returns<OrganizationMemberApiModel[]>();

      console.log('get organization members:', data);

    if (error)
      throw new Error('Error fetching organization members');
    
    return data.map(OrganizationMemberMapper.apiToDto);
  }

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
