import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { ISettingPriceTechnicityCoefficientUseCase } from '@/features/priceSettings/application/useCases/SettingPriceTechnicityCoefficientUseCase';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';
import { createUseSettingPriceTechnicityCoefficientState } from '@/features/priceSettings/presentation/composables/useSettingPriceTechnicityCoefficientState';

export function useSettingPriceTechnicityCoefficientState() {
  return createUseSettingPriceTechnicityCoefficientState({
    authState: container.get<IAuthState>(SYMBOLS.States.AuthState),
    useCase: container.get<ISettingPriceTechnicityCoefficientUseCase>(SYMBOLS.UseCases.Setting.Price.TechnicityCoefficientUseCase),
  });
}
