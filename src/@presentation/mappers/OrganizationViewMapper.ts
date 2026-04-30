import { OrganizationDtoModel } from '@application/dtos/OrganizationDtoModel';
import { OrganizationViewModel } from '../@modules/organization/OrganizationViewModel';

export class OrganizationViewMapper {
  static dtoToView(dto: OrganizationDtoModel): OrganizationViewModel {
    return { ...dto };
  }

  static viewToDto(view: OrganizationViewModel): OrganizationDtoModel {
    return { ...view };
  }
}
