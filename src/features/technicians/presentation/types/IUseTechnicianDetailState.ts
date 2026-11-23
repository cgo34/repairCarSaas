import { ComputedRef, Ref } from 'vue';
import { UserViewModel } from '@/features/users/presentation/models/UserViewModel';
import { TechnicianStatsDto } from '@/features/technicians/application/dtos/TechnicianStatsDto';
import { GarageDto } from '@/features/garages/application/dtos/GarageDto';
import { QuoteDto } from '@/features/quotes/application/dtos/QuoteDto';
import { InvoiceDto } from '@/features/invoices/application/dtos/InvoiceDto';

export interface IUseTechnicianDetailState {
  technician: ComputedRef<UserViewModel | null>;
  stats: ComputedRef<TechnicianStatsDto | null>;
  assignedGarages: ComputedRef<GarageDto[]>;
  quotes: ComputedRef<QuoteDto[]>;
  invoices: ComputedRef<InvoiceDto[]>;
  loading: Ref<boolean>;
  error: Ref<unknown>;
  init(technicianId: string): Promise<void>;
  assignGarage(garageId: string): Promise<void>;
  removeGarage(garageId: string): Promise<void>;
  blockTechnician(): Promise<void>;
  unblockTechnician(): Promise<void>;
  updateCommission(quoteId: string, rate: number | null, paid: boolean): Promise<void>;
  updateInvoiceCommission(invoiceId: string, rate: number | null, paid: boolean): Promise<void>;
}
