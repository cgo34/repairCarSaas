import { ComputedRef, Ref } from 'vue';

import { OrganizationMemberViewModel } from '@/features/organizations/presentation/models/OrganizationMemberViewmodel';
import { OrganizationMemberForm } from '@/features/organizations/presentation/forms/OrganizationMemberForm';
import { GarageViewModel } from '@/features/garages/presentation/models/GarageViewModel';

export interface IUseOrganizationMember {
  members: ComputedRef<OrganizationMemberViewModel[]>;
  garages: ComputedRef<GarageViewModel[]>;
  assignedGarageIds: ComputedRef<string[]>;

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

  loadAssignedGarages(userId: string): Promise<void>;

  toggleGarageAccess(userId: string, garageId: string, assign: boolean): Promise<void>;

  setMemberBlocked(userId: string, blocked: boolean): Promise<void>;
}