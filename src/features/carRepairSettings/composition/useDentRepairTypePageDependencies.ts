import { IDentRepairTypeState } from '@/features/carRepairSettings/presentation/types/IDentRepairTypeState';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';

export function useDentRepairTypePageDependencies() {
  return {
    useDentRepairTypeState: container.get<IDentRepairTypeState>(SYMBOLS.States.CarRepair.DentRepairTypeState),
  };
}
