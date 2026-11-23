import { OrganizationApiModel } from '@/features/organizations/infrastructure/api/OrganizationApiModel';
import { OrganizationDtoModel } from '@/features/organizations/application/dtos/OrganizationDtoModel';

export class OrganizationMapper {
  static apiToDto(api: OrganizationApiModel): OrganizationDtoModel {
    return { ...api };
  }

  static dtoToApi(dto: OrganizationDtoModel): OrganizationApiModel {
    return { ...dto };
  }
}
