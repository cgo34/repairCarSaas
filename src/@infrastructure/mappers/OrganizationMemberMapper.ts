import { OrganizationMemberDto } from "@/@application/dtos/organizations/OrganizationMemberDto";
import { OrganizationMemberApiModel } from "@infrastructure/database/api/OrganizationMemberApiModel";

export class OrganizationMemberMapper {
  static apiToDto(api: OrganizationMemberApiModel): OrganizationMemberDto {
    return { ...api };
  }

  static dtoToApi(dto: OrganizationMemberDto): OrganizationMemberApiModel {
    return { ...dto };
  }
}
