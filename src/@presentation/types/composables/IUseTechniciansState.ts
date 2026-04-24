import { ComputedRef, Ref } from 'vue';
import { UserViewModel } from '@/@presentation/types/models/UserViewModel';
import { TechnicianStatsDto } from '@/@application/dtos/TechnicianStatsDto';

export interface IUseTechniciansState {
  technicians: ComputedRef<UserViewModel[]>;
  stats: ComputedRef<Record<string, TechnicianStatsDto>>;
  loading: Ref<boolean>;
  error: Ref<unknown>;
  init(): Promise<void>;
  blockTechnician(id: string): Promise<void>;
  unblockTechnician(id: string): Promise<void>;
}
