import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { IGarageUseCase } from '@/features/garages/application/useCases/GarageUseCase';
import { ITechnicianGarageAccessRepository } from '@/features/technicians/application/ports/repositories/ITechnicianGarageAccessRepository';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';
import { createUseGarageState } from '@/features/garages/presentation/composables/useGarageState';

export function useGarageState() {
  return createUseGarageState({
    authState: container.get<IAuthState>(SYMBOLS.States.AuthState),
    garageUseCase: container.get<IGarageUseCase>(SYMBOLS.UseCases.Garage),
    garageAccessRepo: container.get<ITechnicianGarageAccessRepository>(SYMBOLS.Repositories.TechnicianGarageAccessRepository),
  });
}
