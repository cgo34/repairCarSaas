import { OrganizationDtoModel } from "@application/dtos/OrganizationDtoModel";
import { OrganizationApiModel } from "../database/api/OrganizationApiModel";

export class OrganizationApiDtoMapper {
  static apiToDto(api: OrganizationApiModel): OrganizationDtoModel {
    return { ...api };
  }

  static dtoToApi(dto: OrganizationDtoModel): OrganizationApiModel {
    return { ...dto };
  }
}
