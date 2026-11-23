import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { ISettingPriceBodyPartCoefficientUseCase } from '@/features/priceSettings/application/useCases/SettingPriceBodyPartCoefficientUseCase';
import { IBodyPartUseCase } from '@/features/carRepairSettings/application/useCases/BodyPartUseCase';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';
import { createUseSettingPriceBodyPartCoefficientState } from '@/features/priceSettings/presentation/composables/useSettingPriceBodyPartCoefficientState';

export function useSettingPriceBodyPartCoefficientState() {
  return createUseSettingPriceBodyPartCoefficientState({
    authState: container.get<IAuthState>(SYMBOLS.States.AuthState),
    useCase: container.get<ISettingPriceBodyPartCoefficientUseCase>(SYMBOLS.UseCases.Setting.Price.BodyPartCoefficientUseCase),
    bodyPartUseCase: container.get<IBodyPartUseCase>(SYMBOLS.UseCases.CarRepair.BodyPartUseCase),
  });
}
