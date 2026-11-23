import { OrganizationDtoModel } from "@/features/organizations/application/dtos/OrganizationDtoModel";
import { OrganizationApiModel } from "@/features/organizations/infrastructure/api/OrganizationApiModel";

export class OrganizationApiDtoMapper {
  static apiToDto(api: OrganizationApiModel): OrganizationDtoModel {
    return { ...api };
  }

  static dtoToApi(dto: OrganizationDtoModel): OrganizationApiModel {
    return { ...dto };
  }
}
