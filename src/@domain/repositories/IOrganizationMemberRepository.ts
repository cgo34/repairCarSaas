import { CreateOrganizationTechnicianDto } from "@/@application/dtos/organizations/CreateOrganizationTechnicianDto";
import { OrganizationMemberDto } from "@/@application/dtos/organizations/OrganizationMemberDto";

export interface IOrganizationMemberRepository {
  getMembersByOrganizationId(organizationId: string): Promise<OrganizationMemberDto[]>;
  getByMemberId(userId: string): Promise<OrganizationMemberDto[]>;
  createOrganizationTechnician(dto: CreateOrganizationTechnicianDto): Promise<OrganizationMemberDto>;
  archiveMember(memberId: string): Promise<void>;
}
