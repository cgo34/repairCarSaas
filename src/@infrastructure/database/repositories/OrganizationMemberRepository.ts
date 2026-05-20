
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

    console.log('Organization members for member', memberId, ':', data);

    const dto = data.map(OrganizationMemberMapper.apiToDto);
    console.log('Mapped organization members DTOs for member', memberId, ':', dto);
    return dto;
  }

  async getMembersByOrganizationId(organizationId: string): Promise<OrganizationMemberDto[]> {
    const { data, error } = await this.clientProvider.getClient()
      .from('organization_members')
      .select(`*, users!organization_members_user_id_fkey(id, email, full_name, first_name, last_name)`)
      .eq('organization_id', organizationId)
      .returns<OrganizationMemberApiModel[]>();

    if (error)
      throw new Error('Error fetching organization members');
    
    return data.map(OrganizationMemberMapper.apiToDto);
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
}
