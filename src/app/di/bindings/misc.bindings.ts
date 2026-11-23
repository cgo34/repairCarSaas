import type { Container } from 'inversify';
import { SYMBOLS } from '@/app/di/tokens';
import { IUseSettingPriceDiameterCoefficientState } from '@/features/priceSettings/presentation/types/IUseSettingPriceDiameterCoefficientState';
import { useSettingPriceDiameterCoefficientState } from '@/features/priceSettings/composition/useSettingPriceDiameterCoefficientState';


export function registerMiscBindings(container: Container): void {
  container.bind<IUseSettingPriceDiameterCoefficientState>(SYMBOLS.States.Setting.Price.DiameterCoefficientState).toDynamicValue(() => {
    return useSettingPriceDiameterCoefficientState();
  });
}
