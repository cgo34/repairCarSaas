import { CreateOrganizationTechnicianDto } from "@/@application/dtos/organizations/CreateOrganizationTechnicianDto";

export interface ICreateOrganizationTechnicianUseCase {
  execute(technician: CreateOrganizationTechnicianDto): Promise<void>;
}