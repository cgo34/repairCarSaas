import { OrganizationMemberDto } from "@/features/organizations/application/dtos/OrganizationMemberDto";
import { OrganizationMemberApiModel } from "@/features/organizations/infrastructure/api/OrganizationMemberApiModel";
import { UserMapper } from "@/features/users/infrastructure/mappers/UserMapper";

export class OrganizationMemberMapper {
  static apiToDto(api: OrganizationMemberApiModel): OrganizationMemberDto {
    return { ...api, users: UserMapper.apiToDto(api.users) };
  }
}
