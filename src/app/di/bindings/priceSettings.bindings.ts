import type { Container } from 'inversify';
import { SYMBOLS } from '@/app/di/tokens';
import { SettingPriceRepository } from '@/features/priceSettings/infrastructure/repositories/SettingPriceRepository';
import { SettingPriceBodyPartCoefficientService } from '@/features/priceSettings/application/services/SettingPriceBodyPartCoefficientService';
import { SettingPriceGeneralService } from '@/features/priceSettings/application/services/SettingPriceGeneralService';
import { SettingPriceImpactCountToUtService } from '@/features/priceSettings/application/services/SettingPriceImpactCountToUtService';
import { SettingPriceTechnicityCoefficientService } from '@/features/priceSettings/application/services/SettingPriceTechnicityCoefficientService';
import { SettingPriceBodyPartCoefficientUseCase } from '@/features/priceSettings/application/useCases/SettingPriceBodyPartCoefficientUseCase';
import { SettingPriceGeneralUseCase } from '@/features/priceSettings/application/useCases/SettingPriceGeneralUseCase';
import { SettingPriceImpactCountToUtUseCase } from '@/features/priceSettings/application/useCases/SettingPriceImpactCountToUtUseCase';
import { SettingPriceTechnicityCoefficientUseCase } from '@/features/priceSettings/application/useCases/SettingPriceTechnicityCoefficientUseCase';
import { SettingPriceUseCase } from '@/features/priceSettings/application/useCases/SettingPriceUseCase';
import { ISettingPriceBodyPartCoefficientRepository } from '@/features/priceSettings/application/ports/repositories/ISettingPriceBodyPartCoefficientRepository';
import { ISettingPriceGeneralRepository } from '@/features/priceSettings/application/ports/repositories/ISettingPriceGeneralRepository';
import { ISettingPriceImpactCountToUtRepository } from '@/features/priceSettings/application/ports/repositories/ISettingPriceImpactCountToUtRepository';
import { ISettingPriceRepository } from '@/features/priceSettings/application/ports/repositories/ISettingPriceRepository';
import { ISettingPriceTechnicityCoefficientRepository } from '@/features/priceSettings/application/ports/repositories/ISettingPriceTechnicityCoefficientRepository';
import { ISettingPriceBodyPartCoefficientService } from '@/features/priceSettings/application/ports/services/ISettingPriceBodyPartCoefficientService';
import { ISettingPriceGeneralService } from '@/features/priceSettings/application/ports/services/ISettingPriceGeneralService';
import { ISettingPriceImpactCountToUtService } from '@/features/priceSettings/application/ports/services/ISettingPriceImpactCountToUtService';
import { ISettingPriceTechnicityCoefficientService } from '@/features/priceSettings/application/ports/services/ISettingPriceTechnicityCoefficientService';
import { ISettingPriceBodyPartCoefficientUseCase } from '@/features/priceSettings/application/useCases/SettingPriceBodyPartCoefficientUseCase';
import { ISettingPriceGeneralUseCase } from '@/features/priceSettings/application/useCases/SettingPriceGeneralUseCase';
import { ISettingPriceImpactCountToUtUseCase } from '@/features/priceSettings/application/useCases/SettingPriceImpactCountToUtUseCase';
import { ISettingPriceTechnicityCoefficientUseCase } from '@/features/priceSettings/application/useCases/SettingPriceTechnicityCoefficientUseCase';
import { ISettingPriceUseCase } from '@/features/priceSettings/application/useCases/SettingPriceUseCase';
import { useSettingPriceBodyPartCoefficientState } from '@/features/priceSettings/composition/useSettingPriceBodyPartCoefficientState';
import { useSettingPriceGeneralState } from '@/features/priceSettings/composition/useSettingPriceGeneralState';
import { useSettingPriceImpactCountToUtState } from '@/features/priceSettings/composition/useSettingPriceImpactCountToUtState';
import { useSettingPriceTechnicityCoefficientState } from '@/features/priceSettings/composition/useSettingPriceTechnicityCoefficientState';
import { IUseSettingPriceBodyPartCoefficientState } from '@/features/priceSettings/presentation/types/IUseSettingPriceBodyPartCoefficientState';
import { IUseSettingPriceGeneralState } from '@/features/priceSettings/presentation/types/IUseSettingPriceGeneralState';
import { IUseSettingPriceImpactCountToUtState } from '@/features/priceSettings/presentation/types/IUseSettingPriceImpactCountToUtState';
import { IUseSettingPriceTechnicityCoefficientState } from '@/features/priceSettings/presentation/types/IUseSettingPriceTechnicityCoefficientState';
import { SettingPriceBodyPartCoefficientRepository } from '@/features/priceSettings/infrastructure/repositories/SettingPriceBodyPartCoefficientRepository';
import { SettingPriceGeneralRepository } from '@/features/priceSettings/infrastructure/repositories/SettingPriceGeneralRepository';
import { SettingPriceImpactCountToUtRepository } from '@/features/priceSettings/infrastructure/repositories/SettingPriceImpactCountToUtRepository';
import { SettingPriceTechnicityCoefficientRepository } from '@/features/priceSettings/infrastructure/repositories/SettingPriceTechnicityCoefficientRepository';
import { ISettingPriceDiameterCoefficientRepository } from '@/features/priceSettings/application/ports/repositories/ISettingPriceDiameterCoefficientRepository';
import { SettingPriceDiameterCoefficientRepository } from '@/features/priceSettings/infrastructure/repositories/SettingPriceDiameterCoefficientRepository';
import { ISettingPriceDiameterCoefficientUseCase } from '@/features/priceSettings/application/useCases/SettingPriceDiameterCoefficientUseCase';
import { SettingPriceDiameterCoefficientUseCase } from '@/features/priceSettings/application/useCases/SettingPriceDiameterCoefficientUseCase';

export function registerPriceSettingsBindings(container: Container): void {
  container.bind<ISettingPriceRepository>(SYMBOLS.Repositories.Setting.Price.SettingPriceRepository).toDynamicValue(ctx => new SettingPriceRepository(ctx.container.get(SYMBOLS.Repositories.Setting.Price.SettingPriceGeneralRepository), ctx.container.get(SYMBOLS.Repositories.Setting.Price.SettingPriceDiameterCoefficientRepository), ctx.container.get(SYMBOLS.Repositories.Setting.Price.SettingPriceBodyPartCoefficient), ctx.container.get(SYMBOLS.Repositories.Setting.Price.SettingPriceTechnicityCoefficient), ctx.container.get(SYMBOLS.Repositories.Setting.Price.SettingPriceImpactCountToUtRepository))).inSingletonScope();
  container.bind<ISettingPriceGeneralRepository>(SYMBOLS.Repositories.Setting.Price.SettingPriceGeneralRepository).toDynamicValue(ctx => new SettingPriceGeneralRepository(ctx.container.get(SYMBOLS.Providers.ClientProvider))).inSingletonScope();
  container.bind<ISettingPriceDiameterCoefficientRepository>(SYMBOLS.Repositories.Setting.Price.SettingPriceDiameterCoefficientRepository).toDynamicValue(ctx => new SettingPriceDiameterCoefficientRepository(ctx.container.get(SYMBOLS.Providers.ClientProvider))).inSingletonScope();
  container.bind<ISettingPriceBodyPartCoefficientRepository>(SYMBOLS.Repositories.Setting.Price.SettingPriceBodyPartCoefficient).toDynamicValue(ctx => new SettingPriceBodyPartCoefficientRepository(ctx.container.get(SYMBOLS.Providers.ClientProvider))).inSingletonScope();
  container.bind<ISettingPriceTechnicityCoefficientRepository>(SYMBOLS.Repositories.Setting.Price.SettingPriceTechnicityCoefficient).toDynamicValue(ctx => new SettingPriceTechnicityCoefficientRepository(ctx.container.get(SYMBOLS.Providers.ClientProvider))).inSingletonScope();
  container.bind<ISettingPriceImpactCountToUtRepository>(SYMBOLS.Repositories.Setting.Price.SettingPriceImpactCountToUtRepository).toDynamicValue(ctx => new SettingPriceImpactCountToUtRepository(ctx.container.get(SYMBOLS.Providers.ClientProvider))).inSingletonScope();
  container.bind<ISettingPriceGeneralService>(SYMBOLS.Services.Setting.Price.SettingPriceGeneralService).toDynamicValue(ctx => new SettingPriceGeneralService(ctx.container.get(SYMBOLS.Repositories.Setting.Price.SettingPriceGeneralRepository))).inSingletonScope();
  container.bind<ISettingPriceBodyPartCoefficientService>(SYMBOLS.Services.Setting.Price.SettingPriceBodyPartCoefficientService).toDynamicValue(ctx => new SettingPriceBodyPartCoefficientService(ctx.container.get(SYMBOLS.Repositories.Setting.Price.SettingPriceBodyPartCoefficient))).inSingletonScope();
  container.bind<ISettingPriceTechnicityCoefficientService>(SYMBOLS.Services.Setting.Price.SettingPriceTechnicityCoefficientService).toDynamicValue(ctx => new SettingPriceTechnicityCoefficientService(ctx.container.get(SYMBOLS.Repositories.Setting.Price.SettingPriceTechnicityCoefficient))).inSingletonScope();
  container.bind<ISettingPriceImpactCountToUtService>(SYMBOLS.Services.Setting.Price.SettingPriceImpactCountToUtService).toDynamicValue(ctx => new SettingPriceImpactCountToUtService(ctx.container.get(SYMBOLS.Repositories.Setting.Price.SettingPriceImpactCountToUtRepository))).inSingletonScope();
  container.bind<ISettingPriceUseCase>(SYMBOLS.UseCases.Setting.Price.AllUseCase).toDynamicValue(ctx => new SettingPriceUseCase(ctx.container.get(SYMBOLS.Repositories.Setting.Price.SettingPriceRepository))).inSingletonScope();
  container.bind<ISettingPriceGeneralUseCase>(SYMBOLS.UseCases.Setting.Price.GeneralUseCase).toDynamicValue(ctx => new SettingPriceGeneralUseCase(ctx.container.get(SYMBOLS.Repositories.Setting.Price.SettingPriceGeneralRepository))).inSingletonScope();
  container.bind<ISettingPriceDiameterCoefficientUseCase>(SYMBOLS.UseCases.Setting.Price.DiameterCoefficientUseCase).toDynamicValue(ctx => new SettingPriceDiameterCoefficientUseCase(ctx.container.get(SYMBOLS.Repositories.Setting.Price.SettingPriceDiameterCoefficientRepository))).inSingletonScope();
  container.bind<ISettingPriceBodyPartCoefficientUseCase>(SYMBOLS.UseCases.Setting.Price.BodyPartCoefficientUseCase).toDynamicValue(ctx => new SettingPriceBodyPartCoefficientUseCase(ctx.container.get(SYMBOLS.Repositories.Setting.Price.SettingPriceBodyPartCoefficient))).inSingletonScope();
  container.bind<ISettingPriceTechnicityCoefficientUseCase>(SYMBOLS.UseCases.Setting.Price.TechnicityCoefficientUseCase).toDynamicValue(ctx => new SettingPriceTechnicityCoefficientUseCase(ctx.container.get(SYMBOLS.Repositories.Setting.Price.SettingPriceTechnicityCoefficient))).inSingletonScope();
  container.bind<ISettingPriceImpactCountToUtUseCase>(SYMBOLS.UseCases.Setting.Price.ImpactCountToUtUseCase).toDynamicValue(ctx => new SettingPriceImpactCountToUtUseCase(ctx.container.get(SYMBOLS.Repositories.Setting.Price.SettingPriceImpactCountToUtRepository))).inSingletonScope();
  container.bind<IUseSettingPriceGeneralState>(SYMBOLS.States.Setting.Price.GeneralState).toDynamicValue(() => {
    return useSettingPriceGeneralState();
  });
  container.bind<IUseSettingPriceBodyPartCoefficientState>(SYMBOLS.States.Setting.Price.BodyPartCoefficientState).toDynamicValue(() => {
    return useSettingPriceBodyPartCoefficientState();
  });
  container.bind<IUseSettingPriceTechnicityCoefficientState>(SYMBOLS.States.Setting.Price.TechnicityCoefficientState).toDynamicValue(() => {
    return useSettingPriceTechnicityCoefficientState();
  });
  container.bind<IUseSettingPriceImpactCountToUtState>(SYMBOLS.States.Setting.Price.ImpactCountToUtState).toDynamicValue(() => {
    return useSettingPriceImpactCountToUtState();
  });
}
