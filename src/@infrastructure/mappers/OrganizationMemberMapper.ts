import { OrganizationMemberDtoModel } from "@application/dtos/OrganizationMemberDtoModel";
import { OrganizationMemberApiModel } from "@infrastructure/database/api/OrganizationMemberApiModel";

export class OrganizationMemberMapper {
  static apiToDto(api: OrganizationMemberApiModel): OrganizationMemberDtoModel {
    return { ...api };
  }

  static dtoToApi(dto: OrganizationMemberDtoModel): OrganizationMemberApiModel {
    return { ...dto };
  }
}
