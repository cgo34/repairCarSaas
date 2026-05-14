import { ComputedRef, Ref } from 'vue';

import { OrganizationMemberViewModel } from './models/organizations/OrganizationMemberViewmodel';
import { OrganizationMemberForm } from './forms/OrganizationMemberForm';

export interface IUseOrganizationMember {
  members: ComputedRef<OrganizationMemberViewModel[]>;

  selectedMemberForm: ComputedRef<OrganizationMemberForm>;

  loading: Ref<boolean>;
  error: Ref<unknown>;

  init(): Promise<void>;

  getMembers(): Promise<OrganizationMemberViewModel[]>;

  selectMember(member: OrganizationMemberViewModel): void;

  resetSelectedMemberForm(): void;

  addMember(form: OrganizationMemberForm): Promise<void>;

  updateMember(form: OrganizationMemberForm): Promise<void>;

  archiveMember(id: string): Promise<void>;
}