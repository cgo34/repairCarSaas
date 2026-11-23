import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { ISettingPriceImpactCountToUtUseCase } from '@/features/priceSettings/application/useCases/SettingPriceImpactCountToUtUseCase';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';
import { createUseSettingPriceImpactCountToUtState } from '@/features/priceSettings/presentation/composables/useSettingPriceImpactCountToUtState';

export function useSettingPriceImpactCountToUtState() {
  return createUseSettingPriceImpactCountToUtState({
    authState: container.get<IAuthState>(SYMBOLS.States.AuthState),
    useCase: container.get<ISettingPriceImpactCountToUtUseCase>(SYMBOLS.UseCases.Setting.Price.ImpactCountToUtUseCase),
  });
}
