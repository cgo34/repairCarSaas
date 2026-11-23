import { IBodyMaterialState } from '@/features/carRepairSettings/presentation/types/IBodyMaterialState';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';

export function useCarBodyMaterialPageDependencies() {
  return {
    useBodyMaterialState: container.get<IBodyMaterialState>(SYMBOLS.States.CarRepair.BodyMaterialState),
  };
}
