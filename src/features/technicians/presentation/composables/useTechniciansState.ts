import { IUserUseCase } from '@/features/users/application/useCases/UserUseCase';
import { IGetTechnicianStatsUseCase } from '@/features/technicians/application/useCases/GetTechnicianStatsUseCase';
import { TechnicianStatsDto } from '@/features/technicians/application/dtos/TechnicianStatsDto';
import { UserMapper } from '@/features/users/presentation/mappers/UserMapper';
import { IUseTechniciansState } from '@/features/technicians/presentation/types/IUseTechniciansState';
import { UserViewModel } from '@/features/users/presentation/models/UserViewModel';
import { computed, ref } from 'vue';

export interface UseTechniciansStateDependencies {
  userUseCase: IUserUseCase;
  statsUseCase: IGetTechnicianStatsUseCase;
}

export function createUseTechniciansState(deps: UseTechniciansStateDependencies): IUseTechniciansState {
  const { userUseCase, statsUseCase } = deps;

  const _technicians = ref<UserViewModel[]>([]);
  const _stats = ref<Record<string, TechnicianStatsDto>>({});
  const loading = ref<boolean>(false);
  const error = ref<unknown>(null);

  const init = async (): Promise<void> => {
    loading.value = true;
    try {
      const allUsers = await userUseCase.getUsers();
      const technicians = allUsers.filter(u =>
        u.role === 'technician' || u.role === 'independant_technician'
      );
      _technicians.value = technicians.map(UserMapper.dtoToView);

      // Charger les stats en parallèle
      const statsResults = await Promise.allSettled(
        technicians.map(t => statsUseCase.execute(t.id!))
      );
      const record: Record<string, TechnicianStatsDto> = {};
      statsResults.forEach((result, i) => {
        const id = technicians[i].id!;
        if (result.status === 'fulfilled') {
          record[id] = result.value;
        } else {
          console.error(`[TechniciansState] Stats error for ${id}:`, result.reason);
        }
      });
      _stats.value = record;
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  };

  const blockTechnician = async (id: string): Promise<void> => {
    await userUseCase.updateUser(id,     { isBlocked: true });
    const idx = _technicians.value.findIndex(t => t.id === id);
    if (idx !== -1) _technicians.value[idx] = { ..._technicians.value[idx], isBlocked: true };
  };

  const unblockTechnician = async (id: string): Promise<void> => {
    await userUseCase.updateUser(id,     { isBlocked: false });
    const idx = _technicians.value.findIndex(t => t.id === id);
    if (idx !== -1) _technicians.value[idx] = { ..._technicians.value[idx], isBlocked: false };
  };

  return {
    technicians: computed(() => _technicians.value),
    stats: computed(() => _stats.value),
    loading,
    error,
    init,
    blockTechnician,
    unblockTechnician,
  };
}
