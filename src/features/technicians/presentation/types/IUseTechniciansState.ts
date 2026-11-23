import { ComputedRef, Ref } from 'vue';
import { UserViewModel } from '@/features/users/presentation/models/UserViewModel';
import { TechnicianStatsDto } from '@/features/technicians/application/dtos/TechnicianStatsDto';

export interface IUseTechniciansState {
  technicians: ComputedRef<UserViewModel[]>;
  stats: ComputedRef<Record<string, TechnicianStatsDto>>;
  loading: Ref<boolean>;
  error: Ref<unknown>;
  init(): Promise<void>;
  blockTechnician(id: string): Promise<void>;
  unblockTechnician(id: string): Promise<void>;
}
