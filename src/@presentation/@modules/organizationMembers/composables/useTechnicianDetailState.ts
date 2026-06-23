import { GarageDto } from '@/@application/dtos/GarageDto';
import { TechnicianStatsDto } from '@/@application/dtos/TechnicianStatsDto';
import { QuoteDto } from '@/@application/dtos/QuoteDto';
import { ITechnicianGarageAccessRepository } from '@/@domain/repositories/ITechnicianGarageAccessRepository';
import { IUserUseCase } from '@/@domain/useCases/IUserUseCase';
import { IGetTechnicianStatsUseCase } from '@/@domain/useCases/technicians/IGetTechnicianStatsUseCase';
import { IQuoteRepository } from '@/@domain/repositories/IQuoteRepository';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { UserMapper } from '@/@presentation/mappers/UserMapper';
import { IUseTechnicianDetailState } from '@/@presentation/types/composables/IUseTechnicianDetailState';
import { UserViewModel } from '@/@presentation/types/models/UserViewModel';
import { computed, ref } from 'vue';

export function useTechnicianDetailState(): IUseTechnicianDetailState {
  const userUseCase = container.get<IUserUseCase>(SYMBOLS.UseCases.UserUseCase);
  const statsUseCase = container.get<IGetTechnicianStatsUseCase>(SYMBOLS.UseCases.TechnicianStats);
  const garageAccessRepo = container.get<ITechnicianGarageAccessRepository>(
    SYMBOLS.Repositories.TechnicianGarageAccessRepository
  );
  const quoteRepo = container.get<IQuoteRepository>(SYMBOLS.Repositories.QuoteRepository);

  const _technician = ref<UserViewModel | null>(null);
  const _stats = ref<TechnicianStatsDto | null>(null);
  const _assignedGarages = ref<GarageDto[]>([]);
  const _quotes = ref<QuoteDto[]>([]);
  const loading = ref<boolean>(false);
  const error = ref<unknown>(null);

  const init = async (technicianId: string): Promise<void> => {
    loading.value = true;
    try {
      // Données du technicien (critique)
      const dto = await userUseCase.getUserById(technicianId);
      _technician.value = dto ? UserMapper.dtoToView(dto) : null;

      // Stats, garages, devis en parallèle (non bloquants)
      const [statsResult, garagesResult, quotesResult] = await Promise.allSettled([
        statsUseCase.execute(technicianId),
        garageAccessRepo.getGaragesByTechnicianId(technicianId),
        quoteRepo.getByTechnicianId(technicianId),
      ]);

      if (statsResult.status === 'fulfilled') _stats.value = statsResult.value;
      else console.error('[Detail] stats error:', statsResult.reason);

      if (garagesResult.status === 'fulfilled') _assignedGarages.value = garagesResult.value;
      else console.error('[Detail] garages error:', garagesResult.reason);

      if (quotesResult.status === 'fulfilled') _quotes.value = quotesResult.value;
      else console.error('[Detail] quotes error:', quotesResult.reason);
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
      await userUseCase.updateUser(_technician.value.id, { isBlocked: true } as any);
      _technician.value = { ..._technician.value, isBlocked: true };
    } catch (e) {
      console.error('[useTechnicianDetailState] blockTechnician error:', e);
      throw e;
    }
  };

  const unblockTechnician = async (): Promise<void> => {
    if (!_technician.value?.id) return;
    try {
      await userUseCase.updateUser(_technician.value.id, { isBlocked: false } as any);
      _technician.value = { ..._technician.value, isBlocked: false };
    } catch (e) {
      console.error('[useTechnicianDetailState] unblockTechnician error:', e);
      throw e;
    }
  };

  const updateCommission = async (quoteId: string, rate: number | null, paid: boolean): Promise<void> => {
    await (quoteRepo as any).updateCommission(quoteId, rate, paid);
    const idx = _quotes.value.findIndex(q => q.id === quoteId);
    if (idx !== -1) {
      _quotes.value[idx] = { ..._quotes.value[idx], commissionRate: rate, commissionPaid: paid };
    }
  };

  return {
    technician: computed(() => _technician.value),
    stats: computed(() => _stats.value),
    assignedGarages: computed(() => _assignedGarages.value),
    quotes: computed(() => _quotes.value),
    loading,
    error,
    init,
    assignGarage,
    removeGarage,
    blockTechnician,
    unblockTechnician,
    updateCommission,
  };
}
