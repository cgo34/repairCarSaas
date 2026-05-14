import { OrganizationMemberViewModel } from '@/@presentation/types/models/organizations/OrganizationMemberViewmodel';
import { OrganizationMemberForm } from '@/@presentation/types/forms/OrganizationMemberForm';

export class OrganizationMemberFormFactory {
  static createEmpty(): OrganizationMemberForm {
    return {
      first_name: '',
      last_name: '',
      email: '',
      role: 'technician',
      percentage_commission: 0,
    };
  }

  static createFromMember(
    member: OrganizationMemberViewModel
  ): OrganizationMemberForm {
    return {
      id: member.id,

      first_name: member.users.first_name,
      last_name: member.users.last_name,
      email: member.users.email,

      role: member.role,
      percentage_commission: member.percentage_commission ?? 0,
    };
  }
}