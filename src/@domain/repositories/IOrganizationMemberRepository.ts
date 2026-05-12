import { CreateOrganizationTechnicianDto } from "@/@application/dtos/organizations/CreateOrganizationTechnicianDto";
import { OrganizationMemberDtoModel } from "@application/dtos/OrganizationMemberDtoModel";

export interface IOrganizationMemberRepository {
  getMembersByOrganizationId(organizationId: string): Promise<OrganizationMemberDtoModel[]>;
  getByMemberId(userId: string): Promise<OrganizationMemberDtoModel[]>;
  createOrganizationTechnician(dto: CreateOrganizationTechnicianDto): Promise<string>;
  archiveMember(memberId: string): Promise<void>;
}
