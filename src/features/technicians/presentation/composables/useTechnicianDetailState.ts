import { GarageDto } from '@/features/garages/application/dtos/GarageDto';
import { TechnicianStatsDto } from '@/features/technicians/application/dtos/TechnicianStatsDto';
import { QuoteDto } from '@/features/quotes/application/dtos/QuoteDto';
import { ITechnicianGarageAccessRepository } from '@/features/technicians/application/ports/repositories/ITechnicianGarageAccessRepository';
import { IUserUseCase } from '@/features/users/application/useCases/UserUseCase';
import { IGetTechnicianStatsUseCase } from '@/features/technicians/application/useCases/GetTechnicianStatsUseCase';
import { IQuoteRepository } from '@/features/quotes/application/ports/repositories/IQuoteRepository';
import { IInvoiceRepository } from '@/features/invoices/application/ports/repositories/IInvoiceRepository';
import { InvoiceDto } from '@/features/invoices/application/dtos/InvoiceDto';
import { UserMapper } from '@/features/users/presentation/mappers/UserMapper';
import { IUseTechnicianDetailState } from '@/features/technicians/presentation/types/IUseTechnicianDetailState';
import { UserViewModel } from '@/features/users/presentation/models/UserViewModel';
import { computed, ref } from 'vue';

export interface UseTechnicianDetailStateDependencies {
  userUseCase: IUserUseCase;
  statsUseCase: IGetTechnicianStatsUseCase;
  garageAccessRepo: ITechnicianGarageAccessRepository;
  quoteRepo: IQuoteRepository;
  invoiceRepo: IInvoiceRepository;
}

export function createUseTechnicianDetailState(deps: UseTechnicianDetailStateDependencies): IUseTechnicianDetailState {
  const { userUseCase, statsUseCase, garageAccessRepo, quoteRepo, invoiceRepo } = deps;

  const _technician = ref<UserViewModel | null>(null);
  const _stats = ref<TechnicianStatsDto | null>(null);
  const _assignedGarages = ref<GarageDto[]>([]);
  const _quotes = ref<QuoteDto[]>([]);
  const _invoices = ref<InvoiceDto[]>([]);
  const loading = ref<boolean>(false);
  const error = ref<unknown>(null);

  const init = async (technicianId: string): Promise<void> => {
    loading.value = true;
    try {
      // Données du technicien (critique)
      const dto = await userUseCase.getUserById(technicianId);
      _technician.value = dto ? UserMapper.dtoToView(dto) : null;

      // Stats, garages, devis, factures en parallèle (non bloquants)
      const [statsResult, garagesResult, quotesResult, invoicesResult] = await Promise.allSettled([
        statsUseCase.execute(technicianId),
        garageAccessRepo.getGaragesByTechnicianId(technicianId),
        quoteRepo.getByTechnicianId(technicianId),
        invoiceRepo.getByTechnicianId(technicianId),
      ]);

      if (statsResult.status === 'fulfilled') _stats.value = statsResult.value;
      else console.error('[Detail] stats error:', statsResult.reason);

      if (garagesResult.status === 'fulfilled') _assignedGarages.value = garagesResult.value;
      else console.error('[Detail] garages error:', garagesResult.reason);

      if (quotesResult.status === 'fulfilled') _quotes.value = quotesResult.value;
      else console.error('[Detail] quotes error:', quotesResult.reason);

      if (invoicesResult.status === 'fulfilled') _invoices.value = invoicesResult.value;
      else console.error('[Detail] invoices error:', invoicesResult.reason);
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  };

  const assignGarage = async (garageId: string): Promise<void> => {
    if (!_technician.value?.id) return;
    await garageAccessRepo.assignGarage(_technician.value.id, garageId);
    const garages = await garageAccessRepo.getGaragesByTechnicianId(_technician.value.id);
    _assignedGarages.value = garages;
  };

  const removeGarage = async (garageId: string): Promise<void> => {
    if (!_technician.value?.id) return;
    await garageAccessRepo.removeGarage(_technician.value.id, garageId);
    _assignedGarages.value = _assignedGarages.value.filter(g => g.id !== garageId);
  };

  const blockTechnician = async (): Promise<void> => {
    if (!_technician.value?.id) return;
    try {
      await userUseCase.updateUser(_technician.value.id,       { isBlocked: true });
      _technician.value = { ..._technician.value, isBlocked: true };
    } catch (e) {
      console.error('[useTechnicianDetailState] blockTechnician error:', e);
      throw e;
    }
  };

  const unblockTechnician = async (): Promise<void> => {
    if (!_technician.value?.id) return;
    try {
      await userUseCase.updateUser(_technician.value.id,       { isBlocked: false });
      _technician.value = { ..._technician.value, isBlocked: false };
    } catch (e) {
      console.error('[useTechnicianDetailState] unblockTechnician error:', e);
      throw e;
    }
  };

  const updateCommission = async (quoteId: string, rate: number | null, paid: boolean): Promise<void> => {
    await quoteRepo.updateCommission(quoteId, rate, paid);
    const idx = _quotes.value.findIndex(q => q.id === quoteId);
    if (idx !== -1) {
      _quotes.value[idx] = { ..._quotes.value[idx], commissionRate: rate, commissionPaid: paid };
    }
  };

  const updateInvoiceCommission = async (invoiceId: string, rate: number | null, paid: boolean): Promise<void> => {
    await invoiceRepo.updateCommission(invoiceId, rate, paid);
    const idx = _invoices.value.findIndex(i => i.id === invoiceId);
    if (idx !== -1) {
      _invoices.value[idx] = { ..._invoices.value[idx], commissionRate: rate, commissionPaid: paid };
    }
  };

  return {
    technician: computed(() => _technician.value),
    stats: computed(() => _stats.value),
    assignedGarages: computed(() => _assignedGarages.value),
    quotes: computed(() => _quotes.value),
    invoices: computed(() => _invoices.value),
    loading,
    error,
    init,
    assignGarage,
    removeGarage,
    blockTechnician,
    unblockTechnician,
    updateCommission,
    updateInvoiceCommission,
  };
}
