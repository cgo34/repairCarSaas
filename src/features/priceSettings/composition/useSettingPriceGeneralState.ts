import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { ISettingPriceGeneralUseCase } from '@/features/priceSettings/application/useCases/SettingPriceGeneralUseCase';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';
import { createUseSettingPriceGeneralState } from '@/features/priceSettings/presentation/composables/useSettingPriceGeneralState';

export function useSettingPriceGeneralState() {
  return createUseSettingPriceGeneralState({
    authState: container.get<IAuthState>(SYMBOLS.States.AuthState),
    settingPriceGeneralUseCase: container.get<ISettingPriceGeneralUseCase>(SYMBOLS.UseCases.Setting.Price.GeneralUseCase),
  });
}
