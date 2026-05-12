
import { inject, injectable } from "inversify";
import { IClientProvider } from "@infrastructure/interfaces/IClientProvider";
import { SupabaseClient } from "@infrastructure/database/clients/SupabaseClient";
import { SYMBOLS } from "@infrastructure/ioc/symbols";
import { OrganizationMemberDtoModel } from "@application/dtos/OrganizationMemberDtoModel";
import { OrganizationMemberApiModel } from "@infrastructure/database/api/OrganizationMemberApiModel";
import { OrganizationMemberMapper } from "@infrastructure/mappers/OrganizationMemberMapper";
import { CreateOrganizationTechnicianDto } from "@/@application/dtos/organizations/CreateOrganizationTechnicianDto";

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
  
  async createOrganizationTechnician(
    dto: CreateOrganizationTechnicianDto
  ): Promise<void> {

    const { error } =
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
  }


  async archiveMember(memberId: string): Promise<void> {
    console.log('Archiving member with ID:', memberId);

    const { error } =
      await this.clientProvider
        .getClient()
        .from('organization_members')
        .update({
          status: 'archived'
        })
        .eq('user_id', memberId);

    if (error) {
      throw error;
    }
  }
}
