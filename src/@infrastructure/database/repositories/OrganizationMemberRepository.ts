
import { inject, injectable } from "inversify";
import { IClientProvider } from "@infrastructure/interfaces/IClientProvider";
import { SupabaseClient } from "@infrastructure/database/clients/SupabaseClient";
import { SYMBOLS } from "@infrastructure/ioc/symbols";
import { OrganizationMemberDto } from "@/@application/dtos/organizations/OrganizationMemberDto";
import { OrganizationMemberApiModel } from "@infrastructure/database/api/OrganizationMemberApiModel";
import { OrganizationMemberMapper } from "@infrastructure/mappers/OrganizationMemberMapper";
import { CreateOrganizationTechnicianDto } from "@/@application/dtos/organizations/CreateOrganizationTechnicianDto";

@injectable()
export class OrganizationMemberRepository {
  constructor(
    @inject(SYMBOLS.Providers.ClientProvider)
    private readonly clientProvider: IClientProvider<SupabaseClient>
  ) {}

  async getByMemberId(memberId: string): Promise<OrganizationMemberDto[]> {
    const { data, error } = await this.clientProvider
      .getClient()
      .from('organization_members')
      .select('*')
      .eq('user_id', memberId);

    if (error) {
      console.error('[OrganizationMemberRepo] getByMemberId error:', error);
      return [];
    }

    const dto = data.map(OrganizationMemberMapper.apiToDto);
    return dto;
  }

  async getMembersByOrganizationId(organizationId: string): Promise<OrganizationMemberDto[]> {
    const { data, error } = await this.clientProvider.getClient()
      .from('organization_members')
      .select(`*, users!organization_members_user_id_fkey(id, email, full_name, first_name, last_name, is_blocked)`)
      .eq('organization_id', organizationId)
      .returns<OrganizationMemberApiModel[]>();

    if (error)
      throw new Error('Error fetching organization members');
    
    return data.map(OrganizationMemberMapper.apiToDto);
  }
  
  async create(data: { user_id: string; organization_id: string; role: string; created_at: string }): Promise<void> {
    const { error } = await this.clientProvider
      .getClient()
      .from('organization_members')
      .insert(data);

    if (error) throw error;
  }

  async createOrganizationTechnician(dto: CreateOrganizationTechnicianDto): Promise<OrganizationMemberApiModel> {
    const { data, error } =
      await this.clientProvider
        .getClient()
        .functions
        .invoke(
          'create-organization-technician',
          {
            body: dto
          }
        )

    if (error) {
      throw error
    }

    return data.member as OrganizationMemberApiModel;
  }


  async archiveMember(memberId: string): Promise<void> {
    const { error } =
      await this.clientProvider
        .getClient()
        .from('organization_members')
        .update({
          status: 'archived'
        })
        .eq('id', memberId);

    if (error) {
      throw error;
    }
  }

  async updateMember(memberId: string, data: Partial<Pick<OrganizationMemberDto, 'role' | 'percentage_commission' | 'status'>> & { first_name?: string; last_name?: string; email?: string }): Promise<OrganizationMemberDto> {
    const { first_name, last_name, email, ...memberFields } = data;

    const { data: updated, error } = await this.clientProvider
      .getClient()
      .from('organization_members')
      .update(memberFields)
      .eq('id', memberId)
      .select(`*, users!organization_members_user_id_fkey(id, email, full_name, first_name, last_name, is_blocked)`)
      .single<OrganizationMemberApiModel>();

    if (error) throw error;

    if (first_name !== undefined || last_name !== undefined || email !== undefined) {
      const userFields: Record<string, string> = {};
      if (first_name !== undefined) userFields.first_name = first_name;
      if (last_name !== undefined) userFields.last_name = last_name;
      if (email !== undefined) userFields.email = email;

      const { error: userError } = await this.clientProvider
        .getClient()
        .from('users')
        .update(userFields)
        .eq('id', updated.user_id);

      if (userError) throw userError;
    }

    return OrganizationMemberMapper.apiToDto(updated);
  }
}
