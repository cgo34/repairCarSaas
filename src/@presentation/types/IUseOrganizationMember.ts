import { ComputedRef, Ref } from 'vue';
import { CreateOrganizationTechnicianViewModel } from './models/organizations/CreateOrganizationTechnicianViewModel';
import { OrganizationMemberViewModel } from './models/OrganizationMemberViewmodel';

export interface IUseOrganizationMember {
  users: ComputedRef<OrganizationMemberViewModel[]>;
  selectedUser: ComputedRef<CreateOrganizationTechnicianViewModel>;
  loading: Ref<boolean>;
  error: Ref<unknown>;

  init(): Promise<void>;
  getUsers(): Promise<OrganizationMemberViewModel[]>;

  selectUser(user: CreateOrganizationTechnicianViewModel): void;
  resetSelectedUser(): void;
  addUser(user: CreateOrganizationTechnicianViewModel): Promise<OrganizationMemberViewModel>;
  updateUser(user: OrganizationMemberViewModel): Promise<OrganizationMemberViewModel>;
  deleteUser(id: string): Promise<void>;
}
