import { CreateOrganizationTechnicianDto } from "@/features/technicians/application/dtos/CreateOrganizationTechnicianDto";
import { OrganizationMemberDto } from "@/features/organizations/application/dtos/OrganizationMemberDto";

export interface IOrganizationMemberRepository {
  getMembersByOrganizationId(organizationId: string): Promise<OrganizationMemberDto[]>;
  getByMemberId(userId: string): Promise<OrganizationMemberDto[]>;
  create(data: { user_id: string; organization_id: string; role: string; created_at: string }): Promise<void>;
  createOrganizationTechnician(dto: CreateOrganizationTechnicianDto): Promise<OrganizationMemberDto>;
  archiveMember(memberId: string): Promise<void>;
  updateMember(memberId: string, data: Partial<Pick<OrganizationMemberDto, 'role' | 'percentage_commission' | 'status'>> & { first_name?: string; last_name?: string; email?: string }): Promise<OrganizationMemberDto>;
}
