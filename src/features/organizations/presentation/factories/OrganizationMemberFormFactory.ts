import { OrganizationMemberViewModel } from '@/features/organizations/presentation/models/OrganizationMemberViewmodel';
import { OrganizationMemberForm } from '@/features/organizations/presentation/forms/OrganizationMemberForm';

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