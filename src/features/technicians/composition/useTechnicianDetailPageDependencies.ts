import { IUseTechnicianDetailState } from '@/features/technicians/presentation/types/IUseTechnicianDetailState';
import { IGarageUseCase } from '@/features/garages/application/useCases/GarageUseCase';
import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';

export function useTechnicianDetailPageDependencies() {
  return {
    state: container.get<IUseTechnicianDetailState>(SYMBOLS.States.TechnicianDetailState),
    garageUseCase: container.get<IGarageUseCase>(SYMBOLS.UseCases.Garage),
    authState: container.get<IAuthState>(SYMBOLS.States.AuthState),
  };
}
