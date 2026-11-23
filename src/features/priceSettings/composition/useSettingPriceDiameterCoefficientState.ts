import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { ISettingPriceDiameterCoefficientUseCase } from '@/features/priceSettings/application/useCases/SettingPriceDiameterCoefficientUseCase';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';
import { UseSettingPriceDiameterCoefficientState } from '@/features/priceSettings/presentation/composables/useSettingPriceDiameterCoefficientState';

export function useSettingPriceDiameterCoefficientState() {
  return new UseSettingPriceDiameterCoefficientState(
    container.get<IAuthState>(SYMBOLS.States.AuthState),
    container.get<ISettingPriceDiameterCoefficientUseCase>(SYMBOLS.UseCases.Setting.Price.DiameterCoefficientUseCase),
  );
}
