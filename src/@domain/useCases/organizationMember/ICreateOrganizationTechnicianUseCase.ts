import { CreateOrganizationTechnicianDto } from "@/@application/dtos/organizations/CreateOrganizationTechnicianDto";
import { OrganizationMemberDto } from "@/@application/dtos/organizations/OrganizationMemberDto";

export interface ICreateOrganizationTechnicianUseCase {
  execute(technician: CreateOrganizationTechnicianDto): Promise<OrganizationMemberDto>;
}