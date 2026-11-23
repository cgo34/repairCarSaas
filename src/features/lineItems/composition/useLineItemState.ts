import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { IBodyMaterialUseCase } from '@/features/carRepairSettings/application/useCases/BodyMaterialUseCase';
import { IDentRepairTypeUseCase } from '@/features/carRepairSettings/application/useCases/DentRepairTypeUSeCase';
import { ISettingPriceUseCase } from '@/features/priceSettings/application/useCases/SettingPriceUseCase';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';
import { createUseLineItemState } from '@/features/lineItems/presentation/composables/useLineItemState';

export function useLineItemState() {
  return createUseLineItemState({
    authState: container.get<IAuthState>(SYMBOLS.States.AuthState),
    bodyMaterialUseCase: container.get<IBodyMaterialUseCase>(SYMBOLS.UseCases.CarRepair.BodyMaterialUseCase),
    repairTypeUseCase: container.get<IDentRepairTypeUseCase>(SYMBOLS.UseCases.CarRepair.DentRepairTypeUseCase),
    priceParamsUseCase: container.get<ISettingPriceUseCase>(SYMBOLS.UseCases.Setting.Price.AllUseCase),
  });
}
