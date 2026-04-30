import { OrganizationApiModel } from '@infrastructure/database/api/OrganizationApiModel';
import { OrganizationDtoModel } from '@application/dtos/OrganizationDtoModel';

export class OrganizationMapper {
  static apiToDto(api: OrganizationApiModel): OrganizationDtoModel {
    return { ...api };
  }

  static dtoToApi(dto: OrganizationDtoModel): OrganizationApiModel {
    return { ...dto };
  }
}
