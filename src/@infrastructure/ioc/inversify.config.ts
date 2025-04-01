import { SYMBOLS } from '@infrastructure/ioc/symbols';
import { Container } from 'inversify';
import 'reflect-metadata';

import { BodyMaterialService } from '@/@application/services/carRepair/BodyMaterialService';
import { BodyPartService } from '@/@application/services/carRepair/BodyPartService';
import { DentRepairTypeService } from '@/@application/services/carRepair/DentRepairTypeService';
import { CostCalculatorService } from '@/@application/services/CostCalculatorService';
import { GarageService } from '@/@application/services/GarageService';
import { SettingPriceBodyMaterialCoefficientService } from '@/@application/services/settings/price/SettingPriceBodyMaterialCoefficientService';
import { SettingPriceBodyPartCoefficientService } from '@/@application/services/settings/price/SettingPriceBodyPartCoefficientService';
import { SettingPriceDiameterCoefficientService } from '@/@application/services/settings/price/SettingPriceDiameterCoefficientService';
import { SettingPriceGeneralService } from '@/@application/services/settings/price/SettingPriceGeneralService';
import { SettingPriceImpactCountToUtService } from '@/@application/services/settings/price/SettingPriceImpactCountToUtService';
import { UserService } from '@/@application/services/UserService';
import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { BodyMaterialUseCase } from '@/@application/useCases/carRepair/BodyMaterialUseCase';
import { BodyPartUseCase } from '@/@application/useCases/carRepair/BodyPartUseCase';
import { DentRepairTypeUseCase } from '@/@application/useCases/carRepair/DentRepairTypeUSeCase';
import { CalculateLineCostUseCase } from '@/@application/useCases/cost/CalculateLineCostUseCase';
import { CalculateTotalCostUseCase } from '@/@application/useCases/cost/CalculateTotalCostUseCase';
import { GarageUseCase } from '@/@application/useCases/GarageUseCase';
import { ILoginUseCase } from '@/@application/useCases/interfaces/auth/ILoginUseCase';
import { AddLineItemUseCase } from '@/@application/useCases/quotes/AddLineItemUseCase';
import { CreateQuoteUseCase } from '@/@application/useCases/quotes/CreateQuoteUseCase';
import { GetQuotesUseCase } from '@/@application/useCases/quotes/GetQuotesUseCase';
import { InsertQuoteUseCase } from '@/@application/useCases/quotes/InsertQuoteUseCase';
import { SettingPriceBodyMaterialCoefficientUseCase } from '@/@application/useCases/settings/price/SettingPriceBodyMaterialCoefficientUseCase';
import { SettingPriceBodyPartCoefficientUseCase } from '@/@application/useCases/settings/price/SettingPriceBodyPartCoefficientUseCase';
import { SettingPriceDiameterCoefficientUseCase } from '@/@application/useCases/settings/price/SettingPriceDiameterCoefficientUseCase';
import { SettingPriceGeneralUseCase } from '@/@application/useCases/settings/price/SettingPriceGeneralUseCase';
import { SettingPriceImpactCountToUtUseCase } from '@/@application/useCases/settings/price/SettingPriceImpactCountToUtUseCase';
import { SettingPriceRepairTypeCoefficientUseCase } from '@/@application/useCases/settings/price/SettingPriceRepairTypeCoefficientUseCase';
import { SettingPriceUseCase } from '@/@application/useCases/settings/price/SettingPriceUseCase';
import { UserUseCase } from '@/@application/useCases/users/UserUseCase';
import { IBodyMaterialRepository } from '@/@domain/repositories/carRepair/IBodyMaterialRepository';
import { IBodyPartRepository } from '@/@domain/repositories/carRepair/IBodyPartRepository';
import { IDentRepairTypeRepository } from '@/@domain/repositories/carRepair/IDentRepairTypeRepository';
import { IGarageRepository } from '@/@domain/repositories/IGarageRepository';
import { IQuoteRepository } from '@/@domain/repositories/IQuoteRepository';
import { IUserRepository } from '@/@domain/repositories/IUserRepository';
import { ISettingPriceBodyMaterialCoefficientRepository } from '@/@domain/repositories/settings/price/ISettingPriceBodyMaterialCoefficientRepository';
import { ISettingPriceBodyPartCoefficientRepository } from '@/@domain/repositories/settings/price/ISettingPriceBodyPartCoefficientRepository';
import { ISettingPriceDiameterCoefficientRepository } from '@/@domain/repositories/settings/price/ISettingPriceDiameterCoefficientRepository';
import { ISettingPriceGeneralRepository } from '@/@domain/repositories/settings/price/ISettingPriceGeneralRepository';
import { ISettingPriceImpactCountToUtRepository } from '@/@domain/repositories/settings/price/ISettingPriceImpactCountToUtRepository';
import { ISettingPriceRepairTypeCoefficientRepository } from '@/@domain/repositories/settings/price/ISettingPriceRepairTypeCoefficientRepository';
import { IBodyMaterialService } from '@/@domain/services/carRepair/IBodyMaterialService';
import { IBodyPartService } from '@/@domain/services/carRepair/IBodyPartService';
import { IDentRepairTypeService } from '@/@domain/services/carRepair/IDentRepairTypeService';
import { ICostCalculatorService } from '@/@domain/services/ICostCalculatorService';
import { IGarageService } from '@/@domain/services/IGarageService';
import { IUserService } from '@/@domain/services/IUserService';
import { ISettingPriceBodyMaterialCoefficientService } from '@/@domain/services/settings/price/ISettingPriceBodyMaterialCoefficientService';
import { ISettingPriceBodyPartCoefficientService } from '@/@domain/services/settings/price/ISettingPriceBodyPartCoefficientService';
import { ISettingPriceDiameterCoefficientService } from '@/@domain/services/settings/price/ISettingPriceDiameterCoefficientService';
import { ISettingPriceGeneralService } from '@/@domain/services/settings/price/ISettingPriceGeneralService';
import { ISettingPriceImpactCountToUtService } from '@/@domain/services/settings/price/ISettingPriceImpactCountToUtService';
import { IAuthUseCase } from '@/@domain/useCases/auth/IAuthUseCase';
import { ILogoutUseCase } from '@/@domain/useCases/auth/ILogoutUseCase';
import { IRegisterUseCase } from '@/@domain/useCases/auth/IRegisterUseCase';
import { IBodyMaterialUseCase } from '@/@domain/useCases/carRepair/IBodyMaterialUseCase';
import { IBodyPartUseCase } from '@/@domain/useCases/carRepair/IBodyPartUseCase';
import { IDentRepairTypeUseCase } from '@/@domain/useCases/carRepair/IDentRepairTypeUseCase';
import { ICalculateLineCostUseCase } from '@/@domain/useCases/cost/ICalculateLineCostUseCase';
import { ICalculateTotalCostUseCase } from '@/@domain/useCases/cost/ICalculateTotalCostUseCase';
import { IGarageUseCase } from '@/@domain/useCases/IGarageUseCase';
import { IUserUseCase } from '@/@domain/useCases/IUserUseCase';
import { IAddQuoteLineItemUseCase } from '@/@domain/useCases/quotes/IAddQuoteLineItemUseCase';
import { ICreateQuoteUseCase } from '@/@domain/useCases/quotes/ICreateQuoteUseCase';
import { IInsertQuoteUseCase } from '@/@domain/useCases/quotes/IInsertQuoteUseCase';
import { IQuotesUseCase } from '@/@domain/useCases/quotes/IQuotesUseCase';
import { ISettingPriceBodyMaterialCoefficientUseCase } from '@/@domain/useCases/settings/price/ISettingPriceBodyMaterialCoefficientUseCase';
import { ISettingPriceBodyPartCoefficientUseCase } from '@/@domain/useCases/settings/price/ISettingPriceBodyPartCoefficientUseCase';
import { ISettingPriceDiameterCoefficientUseCase } from '@/@domain/useCases/settings/price/ISettingPriceDiameterCoefficientUseCase';
import { ISettingPriceGeneralUseCase } from '@/@domain/useCases/settings/price/ISettingPriceGeneralUseCase';
import { ISettingPriceImpactCountToUtUseCase } from '@/@domain/useCases/settings/price/ISettingPriceImpactCountToUtUseCase';
import { ISettingPriceRepairTypeCoefficientUseCase } from '@/@domain/useCases/settings/price/ISettingPriceRepairTypeCoefficientUseCase';
import { ISettingPriceUseCase } from '@/@domain/useCases/settings/price/ISettingPriceUseCase';
import { AuthSupabaseRepository } from '@/@infrastructure/database/repositories/auth/AuthSupabaseRepository';
import { BodyPartRepository } from '@/@infrastructure/database/repositories/carRepair/BodyPartRepository';
import { IClientProvider } from '@/@infrastructure/interfaces/IClientProvider';
import { useGarageState } from '@/@presentation/@modules/garages/composables/useGarageState';
import { useCreateQuoteState } from '@/@presentation/@modules/quotes/composables/useCreateQuoteState';
import { useQuotesState } from '@/@presentation/@modules/quotes/composables/useQuotesState';
import { useBodyMaterialState } from '@/@presentation/@modules/settings/carRepair/composables/useBodyMaterialState';
import { useBodyPartState } from '@/@presentation/@modules/settings/carRepair/composables/useBodyPartState';
import { useDentRepairTypeState } from '@/@presentation/@modules/settings/carRepair/composables/useDentRepairTypeState';
import { useSettingPriceBodyMaterialCoefficientState } from '@/@presentation/@modules/settings/price/composables/useSettingPriceBodyMaterialCoefficientState';
import { useSettingPriceBodyPartCoefficientState } from '@/@presentation/@modules/settings/price/composables/useSettingPriceBodyPartCoefficientState';
import { useSettingPriceDiameterCoefficientState } from '@/@presentation/@modules/settings/price/composables/useSettingPriceDiameterCoefficientState';
import { useSettingPriceGeneralState } from '@/@presentation/@modules/settings/price/composables/useSettingPriceGeneralState';
import { useSettingPriceImpactCountToUtState } from '@/@presentation/@modules/settings/price/composables/useSettingPriceImpactCountToUtState';
import { useSettingPriceRepairTypeCoefficientState } from '@/@presentation/@modules/settings/price/composables/useSettingPriceRepairTypeCoefficientState';
import { useUserState } from '@/@presentation/@modules/users/composables/useUserState';
import { IBodyMaterialState } from '@/@presentation/types/composables/IBodyMaterialState';
import { IBodyPartState } from '@/@presentation/types/composables/IBodyPartState';
import { IDentRepairTypeState } from '@/@presentation/types/composables/IDentRepairTypeState';
import { IUseCreateQuoteState } from '@/@presentation/types/composables/IUseCreateQuoteState';
import { IUseGarageState } from '@/@presentation/types/composables/IUseGarageState';
import { IUseQuotesState } from '@/@presentation/types/composables/IUseQuotesState';
import { IUseUserState } from '@/@presentation/types/composables/IUseUserState';
import { IUseSettingPriceBodyMaterialCoefficientState } from '@/@presentation/types/composables/settings/price/IUseSettingPriceBodyMaterialCoefficientState';
import { IUseSettingPriceBodyPartCoefficientState } from '@/@presentation/types/composables/settings/price/IUseSettingPriceBodyPartCoefficientState';
import { IUseSettingPriceDiameterCoefficientState } from '@/@presentation/types/composables/settings/price/IUseSettingPriceDiameterCoefficientState';
import { IUseSettingPriceGeneralState } from '@/@presentation/types/composables/settings/price/IUseSettingPriceGeneralState';
import { IUseSettingPriceImpactCountToUtState } from '@/@presentation/types/composables/settings/price/IUseSettingPriceImpactCountToUtState';
import { IUseSettingPriceRepairTypeCoefficientState } from '@/@presentation/types/composables/settings/price/IUseSettingPriceRepairTypeCoefficientState';
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
import { QuoteRepository } from '../database/repositories/QuoteRepository';
import { SettingPriceBodyMaterialCoefficientRepository } from '../database/repositories/settings/price/SettingPriceBodyMaterialCoefficientRepository';
import { SettingPriceBodyPartCoefficientRepository } from '../database/repositories/settings/price/SettingPriceBodyPartCoefficientRepository';
import { SettingPriceDiameterCoefficientRepository } from '../database/repositories/settings/price/SettingPriceDiameterCoefficientRepository';
import { SettingPriceGeneralRepository } from '../database/repositories/settings/price/SettingPriceGeneralRepository';
import { SettingPriceImpactCountToUtRepository } from '../database/repositories/settings/price/SettingPriceImpactCountToUtRepository';
import { SettingPriceRepairTypeCoefficientRepository } from '../database/repositories/settings/price/SettingPriceRepairTypeCoefficientRepository';
import { UserRepository } from '../database/repositories/UserRepository';
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
container.bind<ISettingPriceRepairTypeCoefficientRepository>(SYMBOLS.Repositories.Setting.Price.RepairTypeCoefficient).to(SettingPriceRepairTypeCoefficientRepository).inSingletonScope();
/** 3.4. -- User CarRepair Repositories */
container.bind<IUserRepository>(SYMBOLS.Repositories.UserRepository).to(UserRepository).inSingletonScope();
/** 3.5. -- Quote Repositories */
container.bind<IQuoteRepository>(SYMBOLS.Repositories.QuoteRepository).to(QuoteRepository).inSingletonScope();

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
/** 4.4. -- User CarRepair Services */
container.bind<IUserService>(SYMBOLS.Services.UserService).to(UserService).inSingletonScope();
/** 4.5. -- Cost Calculator Services */
container.bind<ICostCalculatorService>(SYMBOLS.Services.CostCalculatorService).to(CostCalculatorService).inSingletonScope();


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
container.bind<ISettingPriceUseCase>(SYMBOLS.UseCases.Setting.Price.AllUseCase).to(SettingPriceUseCase).inSingletonScope();
container.bind<ISettingPriceGeneralUseCase>(SYMBOLS.UseCases.Setting.Price.GeneralUseCase).to(SettingPriceGeneralUseCase).inSingletonScope();
container.bind<ISettingPriceBodyMaterialCoefficientUseCase>(SYMBOLS.UseCases.Setting.Price.BodyMaterialCoefficientUseCase).to(SettingPriceBodyMaterialCoefficientUseCase).inSingletonScope();
container.bind<ISettingPriceBodyPartCoefficientUseCase>(SYMBOLS.UseCases.Setting.Price.BodyPartCoefficientUseCase).to(SettingPriceBodyPartCoefficientUseCase).inSingletonScope();
container.bind<ISettingPriceDiameterCoefficientUseCase>(SYMBOLS.UseCases.Setting.Price.DiameterCoefficientUseCase).to(SettingPriceDiameterCoefficientUseCase).inSingletonScope();
container.bind<ISettingPriceImpactCountToUtUseCase>(SYMBOLS.UseCases.Setting.Price.ImpactCountToUtUseCase).to(SettingPriceImpactCountToUtUseCase).inSingletonScope();
container.bind<ISettingPriceRepairTypeCoefficientUseCase>(SYMBOLS.UseCases.Setting.Price.RepairTypeCoefficientUseCase).to(SettingPriceRepairTypeCoefficientUseCase).inSingletonScope();
/** 5.4. -- User CarRepair UseCases */
container.bind<IUserUseCase>(SYMBOLS.UseCases.UserUseCase).to(UserUseCase).inSingletonScope();
/** 5.5. -- Cost Calculator UseCases */
container.bind<ICalculateLineCostUseCase>(SYMBOLS.UseCases.CostCalculator.CalculateLineCostUseCase).to(CalculateLineCostUseCase).inSingletonScope();
container.bind<ICalculateTotalCostUseCase>(SYMBOLS.UseCases.CostCalculator.CalculateTotalCostUseCase).to(CalculateTotalCostUseCase).inSingletonScope();
/** 5.6. -- Quote UseCases */
// container.bind<IQuoteUseCase>(SYMBOLS.UseCases.Quote.QuoteUseCase).to(QuoteUseCase).inSingletonScope();
container.bind<IQuotesUseCase>(SYMBOLS.UseCases.Quote.GetQuotesUseCase).to(GetQuotesUseCase).inSingletonScope();
container.bind<ICreateQuoteUseCase>(SYMBOLS.UseCases.Quote.CreateQuoteUseCase).to(CreateQuoteUseCase).inSingletonScope();
container.bind<IInsertQuoteUseCase>(SYMBOLS.UseCases.Quote.InsertQuoteUseCase).to(InsertQuoteUseCase).inSingletonScope();
// container.bind<IGetQuoteUseCase>(SYMBOLS.UseCases.Quote.GetQuoteUseCase).to(GetQuoteUseCase).inSingletonScope();
// container.bind<IGetQuoteDetailsUseCase>(SYMBOLS.UseCases.Quote.GetQuoteDetailsUseCase).to(GetQuoteDetailsUseCase).inSingletonScope();
container.bind<IAddQuoteLineItemUseCase>(SYMBOLS.UseCases.Quote.AddLineItemUseCase).to(AddLineItemUseCase).inSingletonScope();
// container.bind<ISaveQuoteUseCase>(SYMBOLS.UseCases.Quote.SaveQuoteUseCase).to(SaveQuoteUseCase).inSingletonScope();
// container.bind<IDeleteQuoteUseCase>(SYMBOLS.UseCases.Quote.DeleteQuoteUseCase).to(DeleteQuoteUseCase).inSingletonScope();


/** 6 - STATES */
container.bind<IAuthState>(SYMBOLS.States.AuthState).to(AuthState).inSingletonScope();
/** 6.1. -- Garage CarRepair States */
container.bind<IUseGarageState>(SYMBOLS.States.GarageState).toDynamicValue(() => {
  return useGarageState();
});
/** 6.2. -- Users CarRepair States */
container.bind<IUseUserState>(SYMBOLS.States.UserState).toDynamicValue(() => {
  return useUserState();
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
container.bind<IUseSettingPriceRepairTypeCoefficientState>(SYMBOLS.States.Setting.Price.RepairTypeCoefficientState).toDynamicValue(() => {
  return useSettingPriceRepairTypeCoefficientState();
});
/** 6.3. -- Quote States */
container.bind<IUseCreateQuoteState>(SYMBOLS.States.Quote.CreateQuoteState).toDynamicValue(() => {
  return useCreateQuoteState();
});
container.bind<IUseQuotesState>(SYMBOLS.States.Quote.GetQuotesUseCase).toDynamicValue(() => {
  return useQuotesState();
});

export { container };

