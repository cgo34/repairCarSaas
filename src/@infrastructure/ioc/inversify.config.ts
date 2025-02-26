import { SYMBOLS } from '@infrastructure/ioc/symbols';
import { Container } from 'inversify';
import 'reflect-metadata';

import { BodyMaterialService } from '@/@application/services/carRepair/BodyMaterialService';
import { BodyPartService } from '@/@application/services/carRepair/BodyPartService';
import { DentRepairTypeService } from '@/@application/services/carRepair/DentRepairTypeService';
import { GarageService } from '@/@application/services/GarageService';
import { SettingPriceBodyMaterialCoefficientService } from '@/@application/services/settings/price/SettingPriceBodyMaterialCoefficientService';
import { SettingPriceBodyPartCoefficientService } from '@/@application/services/settings/price/SettingPriceBodyPartCoefficientService';
import { SettingPriceDiameterCoefficientService } from '@/@application/services/settings/price/SettingPriceDiameterCoefficientService';
import { SettingPriceGeneralService } from '@/@application/services/settings/price/SettingPriceGeneralService';
import { SettingPriceImpactCountToUtService } from '@/@application/services/settings/price/SettingPriceImpactCountToUtService';
import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { BodyMaterialUseCase } from '@/@application/useCases/carRepair/BodyMaterialUseCase';
import { BodyPartUseCase } from '@/@application/useCases/carRepair/BodyPartUseCase';
import { DentRepairTypeUseCase } from '@/@application/useCases/carRepair/DentRepairTypeUSeCase';
import { GarageUseCase } from '@/@application/useCases/GarageUseCase';
import { IAuthUseCase } from '@/@application/useCases/interfaces/auth/IAuthUseCase';
import { ILoginUseCase } from '@/@application/useCases/interfaces/auth/ILoginUseCase';
import { ILogoutUseCase } from '@/@application/useCases/interfaces/auth/ILogoutUseCase';
import { IRegisterUseCase } from '@/@application/useCases/interfaces/auth/IRegisterUseCase';
import { IBodyMaterialUseCase } from '@/@application/useCases/interfaces/carRepair/IBodyMaterialUseCase';
import { IBodyPartUseCase } from '@/@application/useCases/interfaces/carRepair/IBodyPartUseCase';
import { IDentRepairTypeUseCase } from '@/@application/useCases/interfaces/carRepair/IDentRepairTypeUseCase';
import { IGarageUseCase } from '@/@application/useCases/interfaces/IGarageUseCase';
import { ISettingPriceBodyMaterialCoefficientUseCase } from '@/@application/useCases/interfaces/settings/price/ISettingPriceBodyMaterialCoefficientUseCase';
import { ISettingPriceBodyPartCoefficientUseCase } from '@/@application/useCases/interfaces/settings/price/ISettingPriceBodyPartCoefficientUseCase';
import { ISettingPriceDiameterCoefficientUseCase } from '@/@application/useCases/interfaces/settings/price/ISettingPriceDiameterCoefficientUseCase';
import { ISettingPriceGeneralUseCase } from '@/@application/useCases/interfaces/settings/price/ISettingPriceGeneralUseCase';
import { ISettingPriceImpactCountToUtUseCase } from '@/@application/useCases/interfaces/settings/price/ISettingPriceImpactCountToUtUseCase';
import { SettingPriceBodyMaterialCoefficientUseCase } from '@/@application/useCases/settings/price/SettingPriceBodyMaterialCoefficientUseCase';
import { SettingPriceBodyPartCoefficientUseCase } from '@/@application/useCases/settings/price/SettingPriceBodyPartCoefficientUseCase';
import { SettingPriceDiameterCoefficientUseCase } from '@/@application/useCases/settings/price/SettingPriceDiameterCoefficientUseCase';
import { SettingPriceGeneralUseCase } from '@/@application/useCases/settings/price/SettingPriceGeneralUseCase';
import { SettingPriceImpactCountToUtUseCase } from '@/@application/useCases/settings/price/SettingPriceImpactCountToUtUseCase';
import { IBodyMaterialRepository } from '@/@domain/repositories/carRepair/IBodyMaterialRepository';
import { IBodyPartRepository } from '@/@domain/repositories/carRepair/IBodyPartRepository';
import { IDentRepairTypeRepository } from '@/@domain/repositories/carRepair/IDentRepairTypeRepository';
import { IGarageRepository } from '@/@domain/repositories/IGarageRepository';
import { ISettingPriceBodyMaterialCoefficientRepository } from '@/@domain/repositories/settings/price/ISettingPriceBodyMaterialCoefficientRepository';
import { ISettingPriceBodyPartCoefficientRepository } from '@/@domain/repositories/settings/price/ISettingPriceBodyPartCoefficientRepository';
import { ISettingPriceDiameterCoefficientRepository } from '@/@domain/repositories/settings/price/ISettingPriceDiameterCoefficientRepository';
import { ISettingPriceGeneralRepository } from '@/@domain/repositories/settings/price/ISettingPriceGeneralRepository';
import { ISettingPriceImpactCountToUtRepository } from '@/@domain/repositories/settings/price/ISettingPriceImpactCountToUtRepository';
import { IBodyMaterialService } from '@/@domain/services/carRepair/IBodyMaterialService';
import { IBodyPartService } from '@/@domain/services/carRepair/IBodyPartService';
import { IDentRepairTypeService } from '@/@domain/services/carRepair/IDentRepairTypeService';
import { IGarageService } from '@/@domain/services/IGarageService';
import { ISettingPriceBodyMaterialCoefficientService } from '@/@domain/services/settings/price/ISettingPriceBodyMaterialCoefficientService';
import { ISettingPriceBodyPartCoefficientService } from '@/@domain/services/settings/price/ISettingPriceBodyPartCoefficientService';
import { ISettingPriceDiameterCoefficientService } from '@/@domain/services/settings/price/ISettingPriceDiameterCoefficientService';
import { ISettingPriceGeneralService } from '@/@domain/services/settings/price/ISettingPriceGeneralService';
import { ISettingPriceImpactCountToUtService } from '@/@domain/services/settings/price/ISettingPriceImpactCountToUtService';
import { AuthSupabaseRepository } from '@/@infrastructure/database/repositories/auth/AuthSupabaseRepository';
import { BodyPartRepository } from '@/@infrastructure/database/repositories/carRepair/BodyPartRepository';
import { IClientProvider } from '@/@infrastructure/interfaces/IClientProvider';
import { useGarageState } from '@/@presentation/@modules/garages/composables/useGarageState';
import { useBodyMaterialState } from '@/@presentation/@modules/settings/carRepair/composables/useBodyMaterialState';
import { useBodyPartState } from '@/@presentation/@modules/settings/carRepair/composables/useBodyPartState';
import { useDentRepairTypeState } from '@/@presentation/@modules/settings/carRepair/composables/useDentRepairTypeState';
import { useSettingPriceBodyMaterialCoefficientState } from '@/@presentation/@modules/settings/price/composables/useSettingPriceBodyMaterialCoefficientState';
import { useSettingPriceBodyPartCoefficientState } from '@/@presentation/@modules/settings/price/composables/useSettingPriceBodyPartCoefficientState';
import { useSettingPriceDiameterCoefficientState } from '@/@presentation/@modules/settings/price/composables/useSettingPriceDiameterCoefficientState';
import { useSettingPriceGeneralState } from '@/@presentation/@modules/settings/price/composables/useSettingPriceGeneralState';
import { useSettingPriceImpactCountToUtState } from '@/@presentation/@modules/settings/price/composables/useSettingPriceImpactCountToUtState';
import { IBodyMaterialState } from '@/@presentation/types/composables/IBodyMaterialState';
import { IBodyPartState } from '@/@presentation/types/composables/IBodyPartState';
import { IDentRepairTypeState } from '@/@presentation/types/composables/IDentRepairTypeState';
import { IUseGarageState } from '@/@presentation/types/composables/IUseGarageState';
import { IUseSettingPriceBodyMaterialCoefficientState } from '@/@presentation/types/composables/settings/price/IUseSettingPriceBodyMaterialCoefficientState';
import { IUseSettingPriceBodyPartCoefficientState } from '@/@presentation/types/composables/settings/price/IUseSettingPriceBodyPartCoefficientState';
import { IUseSettingPriceDiameterCoefficientState } from '@/@presentation/types/composables/settings/price/IUseSettingPriceDiameterCoefficientState';
import { IUseSettingPriceGeneralState } from '@/@presentation/types/composables/settings/price/IUseSettingPriceGeneralState';
import { IUseSettingPriceImpactCountToUtState } from '@/@presentation/types/composables/settings/price/IUseSettingPriceImpactCountToUtState';
import { AuthService } from '@application/services/auth/AuthService';
import { AuthState } from '@application/states/AuthState';
import { AuthUseCase } from '@application/useCases/auth/AuthUseCase';
import { LoginUseCase } from '@application/useCases/auth/LoginUseCase';
import { LogoutUseCase } from '@application/useCases/auth/LogoutUseCase';
import { RegisterUseCase } from '@application/useCases/auth/RegisterUseCase';
import { IAuthRepository } from '@domain/repositories/IAuthRepository';
import { IAuthService } from '@domain/services/IAuthService';
import { SupabaseClient } from '../database/clients/SupabaseClient';
import { SupabaseClientProvider } from '../database/providers/SupabaseClientProvider';
import { BodyMaterialRepository } from '../database/repositories/carRepair/BodyMaterialRepository';
import { DentRepairTypeRepository } from '../database/repositories/carRepair/DentRepairTypeRepository';
import { GarageRepository } from '../database/repositories/GarageRepository';
import { SettingPriceBodyMaterialCoefficientRepository } from '../database/repositories/settings/price/SettingPriceBodyMaterialCoefficientRepository';
import { SettingPriceBodyPartCoefficientRepository } from '../database/repositories/settings/price/SettingPriceBodyPartCoefficientRepository';
import { SettingPriceDiameterCoefficientRepository } from '../database/repositories/settings/price/SettingPriceDiameterCoefficientRepository';
import { SettingPriceGeneralRepository } from '../database/repositories/settings/price/SettingPriceGeneralRepository';
import { SettingPriceImpactCountToUtRepository } from '../database/repositories/settings/price/SettingPriceImpactCountToUtRepository';
import { IClient } from '../interfaces/IClient';

const container = new Container({ defaultScope: 'Singleton' });

/** 1 - CLIENTS */
container.bind<IClient>(SYMBOLS.Clients.SupabaseClient).to(SupabaseClient).inSingletonScope();

/** 2 - PROVIDERS */
container.bind<IClientProvider<SupabaseClient>>(SYMBOLS.Providers.ClientProvider).to(SupabaseClientProvider).inSingletonScope();

/** 3 - REPOSITORIES */
container.bind<IAuthRepository>(SYMBOLS.Repositories.AuthRepository).to(AuthSupabaseRepository).inSingletonScope();
/** 3.1. -- Garage CarRepair Repository */
container.bind<IGarageRepository>(SYMBOLS.Repositories.GarageRepository).to(GarageRepository).inSingletonScope();
/** 3.2. -- Settings CarRepair Repositories */
container.bind<IBodyPartRepository>(SYMBOLS.Repositories.BodyPartRepository).to(BodyPartRepository).inSingletonScope();
container.bind<IBodyMaterialRepository>(SYMBOLS.Repositories.BodyMaterialRepository).to(BodyMaterialRepository).inSingletonScope();
container.bind<IDentRepairTypeRepository>(SYMBOLS.Repositories.DentRepairTypeRepository).to(DentRepairTypeRepository).inSingletonScope();
/** 3.3 -- Settings CarRepair Repositories */
container.bind<ISettingPriceGeneralRepository>(SYMBOLS.Repositories.Setting.Price.SettingPriceGeneralRepository).to(SettingPriceGeneralRepository).inSingletonScope();
container.bind<ISettingPriceBodyMaterialCoefficientRepository>(SYMBOLS.Repositories.Setting.Price.SettingPriceBodyMaterialCoefficient).to(SettingPriceBodyMaterialCoefficientRepository).inSingletonScope();
container.bind<ISettingPriceBodyPartCoefficientRepository>(SYMBOLS.Repositories.Setting.Price.SettingPriceBodyPartCoefficient).to(SettingPriceBodyPartCoefficientRepository).inSingletonScope();
container.bind<ISettingPriceDiameterCoefficientRepository>(SYMBOLS.Repositories.Setting.Price.SettingPriceDiameterCoefficient).to(SettingPriceDiameterCoefficientRepository).inSingletonScope();
container.bind<ISettingPriceImpactCountToUtRepository>(SYMBOLS.Repositories.Setting.Price.SettingPriceImpactCountToUtRepository).to(SettingPriceImpactCountToUtRepository).inSingletonScope();

/** 4 - SERVICES */
container.bind<IAuthService>(SYMBOLS.Services.AuthService).to(AuthService).inSingletonScope();
/** 4.1. -- Garage CarRepair Services */
container.bind<IGarageService>(SYMBOLS.Services.GarageService).to(GarageService).inSingletonScope();
/** 4.2. -- Settings CarRepair Services */
container.bind<IBodyPartService>(SYMBOLS.Services.BodyPartService).to(BodyPartService).inSingletonScope();
container.bind<IBodyMaterialService>(SYMBOLS.Services.BodyMaterialService).to(BodyMaterialService).inSingletonScope();
container.bind<IDentRepairTypeService>(SYMBOLS.Services.DentRepairTypeService).to(DentRepairTypeService).inSingletonScope();
/** 4.3. -- Settings CarRepair Services */
container.bind<ISettingPriceGeneralService>(SYMBOLS.Services.Setting.Price.SettingPriceGeneralService).to(SettingPriceGeneralService).inSingletonScope();
container.bind<ISettingPriceBodyMaterialCoefficientService>(SYMBOLS.Services.Setting.Price.SettingPriceBodyMaterialCoefficientService).to(SettingPriceBodyMaterialCoefficientService).inSingletonScope();
container.bind<ISettingPriceBodyPartCoefficientService>(SYMBOLS.Services.Setting.Price.SettingPriceBodyPartCoefficientService).to(SettingPriceBodyPartCoefficientService).inSingletonScope();
container.bind<ISettingPriceDiameterCoefficientService>(SYMBOLS.Services.Setting.Price.SettingPriceDiameterCoefficientService).to(SettingPriceDiameterCoefficientService).inSingletonScope();
container.bind<ISettingPriceImpactCountToUtService>(SYMBOLS.Services.Setting.Price.SettingPriceImpactCountToUtService).to(SettingPriceImpactCountToUtService).inSingletonScope();


/** 5 - USE CASES */
container.bind<IAuthUseCase>(SYMBOLS.UseCases.Auth.Container).to(AuthUseCase).inSingletonScope();
container.bind<ILoginUseCase>(SYMBOLS.UseCases.Auth.LoginUseCase).to(LoginUseCase).inSingletonScope();
container.bind<ILogoutUseCase>(SYMBOLS.UseCases.Auth.LogoutUseCase).to(LogoutUseCase).inSingletonScope();
container.bind<IRegisterUseCase>(SYMBOLS.UseCases.Auth.RegisterUseCase).to(RegisterUseCase).inSingletonScope();
/** 5.1. -- Garage CarRepair UseCases */
container.bind<IGarageUseCase>(SYMBOLS.UseCases.Garage).to(GarageUseCase).inSingletonScope();
/** 5.2. -- Settings CarRepair UseCases */
container.bind<IBodyPartUseCase>(SYMBOLS.UseCases.CarRepair.BodyPartUseCase).to(BodyPartUseCase).inSingletonScope();
container.bind<IBodyMaterialUseCase>(SYMBOLS.UseCases.CarRepair.BodyMaterialUseCase).to(BodyMaterialUseCase).inSingletonScope();
container.bind<IDentRepairTypeUseCase>(SYMBOLS.UseCases.CarRepair.DentRepairTypeUseCase).to(DentRepairTypeUseCase).inSingletonScope();
/** 5.3. -- Settings Prices CarRepair UseCases */
container.bind<ISettingPriceGeneralUseCase>(SYMBOLS.UseCases.Setting.Price.GeneralUseCase).to(SettingPriceGeneralUseCase).inSingletonScope();
container.bind<ISettingPriceBodyMaterialCoefficientUseCase>(SYMBOLS.UseCases.Setting.Price.BodyMaterialCoefficientUseCase).to(SettingPriceBodyMaterialCoefficientUseCase).inSingletonScope();
container.bind<ISettingPriceBodyPartCoefficientUseCase>(SYMBOLS.UseCases.Setting.Price.BodyPartCoefficientUseCase).to(SettingPriceBodyPartCoefficientUseCase).inSingletonScope();
container.bind<ISettingPriceDiameterCoefficientUseCase>(SYMBOLS.UseCases.Setting.Price.DiameterCoefficientUseCase).to(SettingPriceDiameterCoefficientUseCase).inSingletonScope();
container.bind<ISettingPriceImpactCountToUtUseCase>(SYMBOLS.UseCases.Setting.Price.ImpactCountToUtUseCase).to(SettingPriceImpactCountToUtUseCase).inSingletonScope();


/** 6 - STATES */
container.bind<IAuthState>(SYMBOLS.States.AuthState).to(AuthState).inSingletonScope();
/** 6.1. -- Garage CarRepair States */
container.bind<IUseGarageState>(SYMBOLS.States.GarageState).toDynamicValue(() => {
  return useGarageState();
});
/** 6.2. -- Settings CarRepair States */
// Crée une factory injectable
container.bind<IBodyPartState>(SYMBOLS.States.CarRepair.BodyPartState).toDynamicValue(() => {
  return useBodyPartState();
});
container.bind<IBodyMaterialState>(SYMBOLS.States.CarRepair.BodyMaterialState).toDynamicValue(() => {
  return useBodyMaterialState();
});
container.bind<IDentRepairTypeState>(SYMBOLS.States.CarRepair.DentRepairTypeState).toDynamicValue(() => {
  return useDentRepairTypeState();
});
/** 6.3. -- Settings Prices CarRepair States */
container.bind<IUseSettingPriceGeneralState>(SYMBOLS.States.Setting.Price.GeneralState).toDynamicValue(() => {
  return useSettingPriceGeneralState();
});
container.bind<IUseSettingPriceBodyMaterialCoefficientState>(SYMBOLS.States.Setting.Price.BodyMaterialCoefficientState).toDynamicValue(() => {
  return useSettingPriceBodyMaterialCoefficientState();
});
container.bind<IUseSettingPriceBodyPartCoefficientState>(SYMBOLS.States.Setting.Price.BodyPartCoefficientState).toDynamicValue(() => {
  return useSettingPriceBodyPartCoefficientState();
});
container.bind<IUseSettingPriceDiameterCoefficientState>(SYMBOLS.States.Setting.Price.DiameterCoefficientState).toDynamicValue(() => {
  return useSettingPriceDiameterCoefficientState();
});
container.bind<IUseSettingPriceImpactCountToUtState>(SYMBOLS.States.Setting.Price.ImpactCountToUtState).toDynamicValue(() => {
  return useSettingPriceImpactCountToUtState();
});

export { container };

