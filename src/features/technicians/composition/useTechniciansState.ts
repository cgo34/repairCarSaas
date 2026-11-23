import { IUserUseCase } from '@/features/users/application/useCases/UserUseCase';
import { IGetTechnicianStatsUseCase } from '@/features/technicians/application/useCases/GetTechnicianStatsUseCase';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';
import { createUseTechniciansState } from '@/features/technicians/presentation/composables/useTechniciansState';

export function useTechniciansState() {
  return createUseTechniciansState({
    userUseCase: container.get<IUserUseCase>(SYMBOLS.UseCases.UserUseCase),
    statsUseCase: container.get<IGetTechnicianStatsUseCase>(SYMBOLS.UseCases.TechnicianStats),
  });
}
