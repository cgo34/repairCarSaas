import { ComputedRef, Ref } from 'vue';
import { UserViewModel } from '@/@presentation/types/models/UserViewModel';
import { TechnicianStatsDto } from '@/@application/dtos/TechnicianStatsDto';
import { GarageDto } from '@/@application/dtos/GarageDto';
import { QuoteDto } from '@/@application/dtos/QuoteDto';

export interface IUseTechnicianDetailState {
  technician: ComputedRef<UserViewModel | null>;
  stats: ComputedRef<TechnicianStatsDto | null>;
  assignedGarages: ComputedRef<GarageDto[]>;
  quotes: ComputedRef<QuoteDto[]>;
  loading: Ref<boolean>;
  error: Ref<unknown>;
  init(technicianId: string): Promise<void>;
  assignGarage(garageId: string): Promise<void>;
  removeGarage(garageId: string): Promise<void>;
  blockTechnician(): Promise<void>;
  unblockTechnician(): Promise<void>;
  updateCommission(quoteId: string, rate: number | null, paid: boolean): Promise<void>;
}
