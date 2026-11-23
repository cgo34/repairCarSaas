import { IUseTechniciansState } from '@/features/technicians/presentation/types/IUseTechniciansState';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';

export function useTechniciansPageDependencies() {
  return {
    state: container.get<IUseTechniciansState>(SYMBOLS.States.TechniciansState),
  };
}
