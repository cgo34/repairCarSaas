import { OrganizationMemberDto } from '@/@application/dtos/organizations/OrganizationMemberDto';
import { UserDto } from '@/@application/dtos/UserDto';

import {
  OrganizationMemberUserViewModel,
  OrganizationMemberViewModel,
} from '@/@presentation/types/models/organizations/OrganizationMemberViewmodel';

export class OrganizationMemberMapper {
  /**
   * ============================================================
   * DTO -> VIEW
   * ============================================================
   */

  static dtoToView(
    dto: OrganizationMemberDto
  ): OrganizationMemberViewModel {
    return {
      id: dto.id ?? '',

      organization_id: dto.organization_id,

      user_id: dto.user_id,

      role: dto.role,

      percentage_commission:
        dto.percentage_commission,

      status: dto.status,

      users: OrganizationMemberMapper.mapUserDtoToView(dto.users),
    };
  }

  /**
   * ============================================================
   * VIEW -> DTO
   * ============================================================
   */

  static viewToDto(
    view: OrganizationMemberViewModel
  ): OrganizationMemberDto {
    return {
      id: view.id,

      organization_id: view.organization_id,

      user_id: view.user_id,

      role: view.role,

      percentage_commission:
        view.percentage_commission,

      status: view.status,

      created_at: '',

      users: {
        id: view.users.id,

        email: view.users.email,

        first_name: view.users.first_name,

        last_name: view.users.last_name,

        full_name: `${view.users.first_name} ${view.users.last_name}`.trim(),
      },
    };
  }

  /**
   * ============================================================
   * PRIVATE
   * ============================================================
   */

  private static mapUserDtoToView(
    user: UserDto
  ): OrganizationMemberUserViewModel {
    return {
      id: user.id,

      full_name: user.full_name,

      first_name: user.first_name ?? '',

      last_name: user.last_name ?? '',

      email: user.email,
    };
  }
}