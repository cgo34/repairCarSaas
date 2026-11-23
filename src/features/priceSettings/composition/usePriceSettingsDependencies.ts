import { IUseSettingPriceBodyPartCoefficientState } from '@/features/priceSettings/presentation/types/IUseSettingPriceBodyPartCoefficientState';
import { IUseSettingPriceGeneralState } from '@/features/priceSettings/presentation/types/IUseSettingPriceGeneralState';
import { IUseSettingPriceImpactCountToUtState } from '@/features/priceSettings/presentation/types/IUseSettingPriceImpactCountToUtState';
import { IUseSettingPriceTechnicityCoefficientState } from '@/features/priceSettings/presentation/types/IUseSettingPriceTechnicityCoefficientState';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';

export function usePriceSettingsDependencies() {
  return {
    useSettingPriceGeneralState: container.get<IUseSettingPriceGeneralState>(SYMBOLS.States.Setting.Price.GeneralState),
    useSettingPriceImpactCountToUtState: container.get<IUseSettingPriceImpactCountToUtState>(SYMBOLS.States.Setting.Price.ImpactCountToUtState),
    useSettingPriceTechnicityCoefficientState: container.get<IUseSettingPriceTechnicityCoefficientState>(SYMBOLS.States.Setting.Price.TechnicityCoefficientState),
    useSettingPriceBodyPartCoefficientState: container.get<IUseSettingPriceBodyPartCoefficientState>(SYMBOLS.States.Setting.Price.BodyPartCoefficientState),
  };
}
