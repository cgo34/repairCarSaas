import { IDentRepairTypeUseCase } from '@/features/carRepairSettings/application/useCases/DentRepairTypeUSeCase';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';
import { createUseDentRepairTypeState } from '@/features/carRepairSettings/presentation/composables/useDentRepairTypeState';

export function useDentRepairTypeState() {
  return createUseDentRepairTypeState({
    dentRepairTypeUseCase: container.get<IDentRepairTypeUseCase>(SYMBOLS.UseCases.CarRepair.DentRepairTypeUseCase),
  });
}
