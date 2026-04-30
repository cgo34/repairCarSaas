import { RegisterUserWithOrganizationUseCase } from '@/@application/useCases/auth/RegisterUserWithOrganizationUseCase';
import { IRegisterUserWithOrganizationUseCase } from '@/@domain/useCases/auth/IRegisterUserWithOrganizationUseCase';

import { OrganizationRepository } from '@/@infrastructure/database/repositories/OrganizationRepository';
import { OrganizationMemberRepository } from '@/@infrastructure/database/repositories/OrganizationMemberRepository';
import { IOrganizationRepository } from '@/@domain/repositories/IOrganizationRepository';
import { IOrganizationMemberRepository } from '@/@domain/repositories/IOrganizationMemberRepository';
// TODO: (GCE) -> TO BE MOVED TO CORE

import { SYMBOLS } from '@infrastructure/ioc/symbols';
import { Container } from 'inversify';
import 'reflect-metadata';

import { SubscriptionService } from '@/@application/services/subscription/SubscriptionService';
import { BodyMaterialService } from '@/@application/services/carRepair/BodyMaterialService';
import { BodyPartService } from '@/@application/services/carRepair/BodyPartService';
import { DentRepairTypeService } from '@/@application/services/carRepair/DentRepairTypeService';
import { CostCalculatorService } from '@/@application/services/CostCalculatorService';
import { GarageService } from '@/@application/services/GarageService';
import { VehicleService } from '@/@application/services/VehicleService';
import { SettingPriceBodyMaterialCoefficientService } from '@/@application/services/settings/price/SettingPriceBodyMaterialCoefficientService';
import { SettingPriceBodyPartCoefficientService } from '@/@application/services/settings/price/SettingPriceBodyPartCoefficientService';
import { SettingPriceGeneralService } from '@/@application/services/settings/price/SettingPriceGeneralService';
import { SettingPriceImpactCountToUtService } from '@/@application/services/settings/price/SettingPriceImpactCountToUtService';
import { SettingPriceTechnicityCoefficientService } from '@/@application/services/settings/price/SettingPriceTechnicityCoefficientService';
import { UserService } from '@/@application/services/UserService';
import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { ISubscriptionState } from '@/@application/states/interfaces/ISubscriptionState';
import { SubscriptionState } from '@/@application/states/SubscriptionState';
import { BodyMaterialUseCase } from '@/@application/useCases/carRepair/BodyMaterialUseCase';
import { BodyPartUseCase } from '@/@application/useCases/carRepair/BodyPartUseCase';
import { DentRepairTypeUseCase } from '@/@application/useCases/carRepair/DentRepairTypeUSeCase';
import { CalculateLineCostUseCase } from '@/@application/useCases/cost/CalculateLineCostUseCase';
import { CalculateTotalCostUseCase } from '@/@application/useCases/cost/CalculateTotalCostUseCase';
import { GarageUseCase } from '@/@application/useCases/GarageUseCase';
import { VehicleUseCase } from '@/@application/useCases/VehicleUseCase';
import { GetDocumentStatusUseCase } from '@/@application/useCases/GetDocumentStatusUseCase';
import { ILoginUseCase } from '@/@application/useCases/interfaces/auth/ILoginUseCase';
import { AddInvoiceLineItemUseCase } from '@/@application/useCases/invoices/AddInvoiceLineItemUseCase';
import { CreateInvoiceUseCase } from '@/@application/useCases/invoices/CreateInvoiceUseCase';
import { DeleteInvoiceUseCase } from '@/@application/useCases/invoices/DeleteInvoiceUseCase';
import { GenerateInvoicePdfUseCase } from '@/@application/useCases/invoices/GenerateInvoicePdfUseCase';
import { GetInvoiceDetailUseCase } from '@/@application/useCases/invoices/GetInvoiceDetailUseCase';
import { GetInvoicesUseCase } from '@/@application/useCases/invoices/GetInvoicesUseCase';
import { GetInvoiceUseCase } from '@/@application/useCases/invoices/GetInvoiceUseCase';
import { InsertInvoiceUseCase } from '@/@application/useCases/invoices/InsertInvoiceUseCase';
import { SendInvoiceUseCase } from '@/@application/useCases/invoices/SendInvoiceUseCase';
import { UpdateInvoiceUseCase } from '@/@application/useCases/invoices/UpdateInvoiceUseCase';
import { ViewInvoiceUseCase } from '@/@application/useCases/invoices/ViewInvoiceUseCase';
import { DeleteLineItemUseCase } from '@/@application/useCases/lineItem/DeleteLineItemUseCase';
import { AddQuoteLineItemUseCase } from '@/@application/useCases/quotes/AddQuoteLineItemUseCase';
import { CreateQuoteUseCase } from '@/@application/useCases/quotes/CreateQuoteUseCase';
import { DeleteQuoteUseCase } from '@/@application/useCases/quotes/DeleteQuoteUseCase';
import { DuplicateQuoteToInvoiceUseCase } from '@/@application/useCases/quotes/DuplicateQuoteToInvoiceUseCase';
import { GenerateQuotePdfUseCase } from '@/@application/useCases/quotes/GenerateQuotePdfUseCase';
import { GetQuoteDetailUseCase } from '@/@application/useCases/quotes/GetQuoteDetailUseCase';
import { GetQuotesUseCase } from '@/@application/useCases/quotes/GetQuotesUseCase';
import { GetQuoteUseCase } from '@/@application/useCases/quotes/GetQuoteUseCase';
import { InsertQuoteUseCase } from '@/@application/useCases/quotes/InsertQuoteUseCase';
import { SendQuoteUseCase } from '@/@application/useCases/quotes/SendQuoteUseCase';
import { UpdateQuoteUseCase } from '@/@application/useCases/quotes/UpdateQuoteUseCase';
import { UpdateStatusQuoteUseCase } from '@/@application/useCases/quotes/UpdateStatusQuoteUseCase';
import { ViewQuoteUseCase } from '@/@application/useCases/quotes/ViewQuoteUseCase';
import { SettingPriceBodyPartCoefficientUseCase } from '@/@application/useCases/settings/price/SettingPriceBodyPartCoefficientUseCase';
import { SettingPriceGeneralUseCase } from '@/@application/useCases/settings/price/SettingPriceGeneralUseCase';
import { SettingPriceImpactCountToUtUseCase } from '@/@application/useCases/settings/price/SettingPriceImpactCountToUtUseCase';
import { SettingPriceTechnicityCoefficientUseCase } from '@/@application/useCases/settings/price/SettingPriceTechnicityCoefficientUseCase';
import { SettingPriceUseCase } from '@/@application/useCases/settings/price/SettingPriceUseCase';
import { GetCurrentSubscriptionUseCase } from '@/@application/useCases/subscription/GetCurrentSubscriptionUseCase';
import { SubscribeToFreePlanUseCase } from '@/@application/useCases/subscription/SubscribeToFreePlanUseCase';
import { CompanySettingsUseCase } from '@/@application/useCases/CompanySettingsUseCase';
import { CreateUserUseCase } from '@/@application/useCases/users/CreateUserUseCase';
import { UserUseCase } from '@/@application/useCases/users/UserUseCase';
import { IRegionManager } from '@/@core/managers/interfaces/IRegionManager';
import { RegionManager } from '@/@core/managers/RegionManager';
import { IBodyMaterialRepository } from '@/@domain/repositories/carRepair/IBodyMaterialRepository';
import { IBodyPartRepository } from '@/@domain/repositories/carRepair/IBodyPartRepository';
import { IDentRepairTypeRepository } from '@/@domain/repositories/carRepair/IDentRepairTypeRepository';
import { ICompanySettingsRepository } from '@/@domain/repositories/ICompanySettingsRepository';
import { IDocumentStatusRepository } from '@/@domain/repositories/IDocumentStatusRepository';
import { IGarageRepository } from '@/@domain/repositories/IGarageRepository';
import { IVehicleRepository } from '@/@domain/repositories/IVehicleRepository';
import { IInvoiceDetailRepository } from '@/@domain/repositories/IInvoiceDetailRepository';
import { IInvoiceRepository } from '@/@domain/repositories/IInvoiceRepository';
import { IQuoteDetailRepository } from '@/@domain/repositories/IQuoteDetailRepository';
import { IQuoteRepository } from '@/@domain/repositories/IQuoteRepository';
import { ISubscriptionRepository } from '@/@domain/repositories/ISubscriptionRepository';
import { IUserRepository } from '@/@domain/repositories/IUserRepository';
import { ISettingPriceBodyPartCoefficientRepository } from '@/@domain/repositories/settings/price/ISettingPriceBodyPartCoefficientRepository';
import { ISettingPriceGeneralRepository } from '@/@domain/repositories/settings/price/ISettingPriceGeneralRepository';
import { ISettingPriceImpactCountToUtRepository } from '@/@domain/repositories/settings/price/ISettingPriceImpactCountToUtRepository';
import { ISettingPriceRepository } from '@/@domain/repositories/settings/price/ISettingPriceRepository';
import { ISettingPriceTechnicityCoefficientRepository } from '@/@domain/repositories/settings/price/ISettingPriceTechnicityCoefficientRepository';
import { IBodyMaterialService } from '@/@domain/services/carRepair/IBodyMaterialService';
import { IBodyPartService } from '@/@domain/services/carRepair/IBodyPartService';
import { IDentRepairTypeService } from '@/@domain/services/carRepair/IDentRepairTypeService';
import { ICostCalculatorService } from '@/@domain/services/ICostCalculatorService';
import { IDownloadService } from '@/@domain/services/IDownloadService';
import { IGarageService } from '@/@domain/services/IGarageService';
import { IVehicleService } from '@/@domain/services/IVehicleService';
import { IPdfGenerator } from '@/@domain/services/IPdfGenerator';
import { IUserService } from '@/@domain/services/IUserService';
import { ISettingPriceBodyPartCoefficientService } from '@/@domain/services/settings/price/ISettingPriceBodyPartCoefficientService';
import { ISettingPriceGeneralService } from '@/@domain/services/settings/price/ISettingPriceGeneralService';
import { ISettingPriceImpactCountToUtService } from '@/@domain/services/settings/price/ISettingPriceImpactCountToUtService';
import { ISettingPriceTechnicityCoefficientService } from '@/@domain/services/settings/price/ISettingPriceTechnicityCoefficientService';
import { ICompanySettingsUseCase } from '@/@domain/useCases/ICompanySettingsUseCase';
import { IAuthUseCase } from '@/@domain/useCases/auth/IAuthUseCase';
import { ILogoutUseCase } from '@/@domain/useCases/auth/ILogoutUseCase';
import { IRegisterUseCase } from '@/@domain/useCases/auth/IRegisterUseCase';
import { IBodyMaterialUseCase } from '@/@domain/useCases/carRepair/IBodyMaterialUseCase';
import { IBodyPartUseCase } from '@/@domain/useCases/carRepair/IBodyPartUseCase';
import { IDentRepairTypeUseCase } from '@/@domain/useCases/carRepair/IDentRepairTypeUseCase';
import { ICalculateLineCostUseCase } from '@/@domain/useCases/cost/ICalculateLineCostUseCase';
import { ICalculateTotalCostUseCase } from '@/@domain/useCases/cost/ICalculateTotalCostUseCase';
import { IGarageUseCase } from '@/@domain/useCases/IGarageUseCase';
import { IVehicleUseCase } from '@/@domain/useCases/IVehicleUseCase';
import { IGetDocumentStatusUseCase } from '@/@domain/useCases/IGetDocumentStatusUseCase';
import { IAddInvoiceLineItemUseCase } from '@/@domain/useCases/invoices/IAddInvoiceLineItemUseCase';
import { ICreateInvoiceUseCase } from '@/@domain/useCases/invoices/ICreateInvoiceUseCase';
import { IDeleteInvoiceUseCase } from '@/@domain/useCases/invoices/IDeleteInvoiceUseCase';
import { IGenerateInvoicePdfUseCase } from '@/@domain/useCases/invoices/IGenerateInvoicePdfUseCase';
import { IGetInvoiceDetailUseCase } from '@/@domain/useCases/invoices/IGetInvoiceDetailUseCase';
import { IGetInvoiceUseCase } from '@/@domain/useCases/invoices/IGetInvoiceUseCase';
import { IInsertInvoiceUseCase } from '@/@domain/useCases/invoices/IInsertInvoiceUseCase';
import { IInvoicesUseCase } from '@/@domain/useCases/invoices/IInvoicesUseCase';
import { ISendInvoiceUseCase } from '@/@domain/useCases/invoices/ISendInvoiceUseCase';
import { IUpdateInvoiceUseCase } from '@/@domain/useCases/invoices/IUpdateInvoiceUseCase';
import { IViewInvoiceUseCase } from '@/@domain/useCases/invoices/IViewInvoiceUseCase';
import { IUserUseCase } from '@/@domain/useCases/IUserUseCase';
import { IDeleteLineItemUseCase } from '@/@domain/useCases/lineItem/ILineItemUseCase';
import { IAddQuoteLineItemUseCase } from '@/@domain/useCases/quotes/IAddQuoteLineItemUseCase';
import { ICreateQuoteUseCase } from '@/@domain/useCases/quotes/ICreateQuoteUseCase';
import { IDeleteQuoteUseCase } from '@/@domain/useCases/quotes/IDeleteQuoteUseCase';
import { IDuplicateQuoteToInvoiceUseCase } from '@/@domain/useCases/quotes/IDuplicateQuoteToInvoiceUseCase';
import { IGenerateQuotePdfUseCase } from '@/@domain/useCases/quotes/IGenerateQuotePdfUseCase';
import { IGetQuoteDetailUseCase } from '@/@domain/useCases/quotes/IGetQuoteDetailUseCase';
import { IGetQuoteUseCase } from '@/@domain/useCases/quotes/IGetQuoteUseCase';
import { IInsertQuoteUseCase } from '@/@domain/useCases/quotes/IInsertQuoteUseCase';
import { IQuotesUseCase } from '@/@domain/useCases/quotes/IQuotesUseCase';
import { ISendQuoteUseCase } from '@/@domain/useCases/quotes/ISendQuoteUseCase';
import { IUpdateQuoteUseCase } from '@/@domain/useCases/quotes/IUpdateQuoteUseCase';
import { IUpdateStatusQuoteUseCase } from '@/@domain/useCases/quotes/IUpdateStatusQuoteUseCase';
import { IViewQuoteUseCase } from '@/@domain/useCases/quotes/IViewQuoteUseCase';
import { ISettingPriceBodyPartCoefficientUseCase } from '@/@domain/useCases/settings/price/ISettingPriceBodyPartCoefficientUseCase';
import { ISettingPriceGeneralUseCase } from '@/@domain/useCases/settings/price/ISettingPriceGeneralUseCase';
import { ISettingPriceImpactCountToUtUseCase } from '@/@domain/useCases/settings/price/ISettingPriceImpactCountToUtUseCase';
import { ISettingPriceTechnicityCoefficientUseCase } from '@/@domain/useCases/settings/price/ISettingPriceTechnicityCoefficientUseCase';
import { ISettingPriceUseCase } from '@/@domain/useCases/settings/price/ISettingPriceUseCase';
import { IGetCurrentSubscriptionUseCase } from '@/@domain/useCases/subscription/IGetCurrentSubscriptionUseCase';
import { ISubscribeToFreePlanUseCase } from '@/@domain/useCases/subscription/ISubscribeToFreePlanUseCase';
import { ICreateUserUseCase } from '@/@domain/useCases/user/ICreateUserUseCase';
import { CompanySettingsRepository } from '@/@infrastructure/database/repositories/CompanySettingsRepository';
import { AuthSupabaseRepository } from '@/@infrastructure/database/repositories/auth/AuthSupabaseRepository';
import { BodyPartRepository } from '@/@infrastructure/database/repositories/carRepair/BodyPartRepository';
import { IClientProvider } from '@/@infrastructure/interfaces/IClientProvider';
import { useCompanySettingsState } from '@/@presentation/@modules/account/composables/useCompanySettingsState';
import { useProfileState } from '@/@presentation/@modules/account/composables/useProfileState';
import { useGarageState } from '@/@presentation/@modules/garages/composables/useGarageState';
import { useCreateInvoiceState } from '@/@presentation/@modules/invoices/composables/useCreateInvoiceState';
import { useEditInvoiceState } from '@/@presentation/@modules/invoices/composables/useEditInvoiceState';
import { useInvoicesState } from '@/@presentation/@modules/invoices/composables/useInvoicesState';
import { useViewInvoiceState } from '@/@presentation/@modules/invoices/composables/useViewInvoiceState';
import { useCreateQuoteState } from '@/@presentation/@modules/quotes/composables/useCreateQuoteState';
import { useEditQuoteState } from '@/@presentation/@modules/quotes/composables/useEditQuoteState';
import { useQuotesState } from '@/@presentation/@modules/quotes/composables/useQuotesState';
import { useViewQuoteState } from '@/@presentation/@modules/quotes/composables/useViewQuoteState';
import { useBodyMaterialState } from '@/@presentation/@modules/settings/carRepair/composables/useBodyMaterialState';
import { useBodyPartState } from '@/@presentation/@modules/settings/carRepair/composables/useBodyPartState';
import { useDentRepairTypeState } from '@/@presentation/@modules/settings/carRepair/composables/useDentRepairTypeState';
import { useSettingPriceBodyPartCoefficientState } from '@/@presentation/@modules/settings/price/composables/useSettingPriceBodyPartCoefficientState';
import { useSettingPriceGeneralState } from '@/@presentation/@modules/settings/price/composables/useSettingPriceGeneralState';
import { useSettingPriceImpactCountToUtState } from '@/@presentation/@modules/settings/price/composables/useSettingPriceImpactCountToUtState';
import { useSettingPriceTechnicityCoefficientState } from '@/@presentation/@modules/settings/price/composables/useSettingPriceTechnicityCoefficientState';
import { useUserState } from '@/@presentation/@modules/users/composables/useUserState';
import { IBodyMaterialState } from '@/@presentation/types/composables/IBodyMaterialState';
import { IBodyPartState } from '@/@presentation/types/composables/IBodyPartState';
import { IDentRepairTypeState } from '@/@presentation/types/composables/IDentRepairTypeState';
import { IUseCreateInvoiceState } from '@/@presentation/types/composables/IUseCreateInvoiceState';
import { IUseCreateQuoteState } from '@/@presentation/types/composables/IUseCreateQuoteState';
import { IUseEditInvoiceState } from '@/@presentation/types/composables/IUseEditInvoiceState';
import { IUseEditQuoteState } from '@/@presentation/types/composables/IUseEditQuoteState';
import { IUseCompanySettingsState } from '@/@presentation/types/composables/IUseCompanySettingsState';
import { IUseProfileState } from '@/@presentation/types/composables/IUseProfileState';
import { IUseGarageState } from '@/@presentation/types/composables/IUseGarageState';
import { IUseInvoicesState } from '@/@presentation/types/composables/IUseInvoicesStates';
import { IUseQuotesState } from '@/@presentation/types/composables/IUseQuotesState';
import { IUseUserState } from '@/@presentation/types/composables/IUseUserState';
import { IUseViewInvoiceState } from '@/@presentation/types/composables/IUseViewInvoiceState';
import { IUseViewQuoteState } from '@/@presentation/types/composables/IUseViewQuoteState';
import { IUseSettingPriceBodyPartCoefficientState } from '@/@presentation/types/composables/settings/price/IUseSettingPriceBodyPartCoefficientState';
import { IUseSettingPriceGeneralState } from '@/@presentation/types/composables/settings/price/IUseSettingPriceGeneralState';
import { IUseSettingPriceImpactCountToUtState } from '@/@presentation/types/composables/settings/price/IUseSettingPriceImpactCountToUtState';
import { IUseSettingPriceTechnicityCoefficientState } from '@/@presentation/types/composables/settings/price/IUseSettingPriceTechnicityCoefficientState';
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
import { DocumentStatusRepository } from '../database/repositories/DocumentStatusRepository';
import { GarageRepository } from '../database/repositories/GarageRepository';
import { VehicleRepository } from '../database/repositories/VehicleRepository';
import { InvoiceDetailRepository } from '../database/repositories/InvoiceDetailRepository';
import { InvoiceRepository } from '../database/repositories/InvoiceRepository';
import { QuoteDetailRepository } from '../database/repositories/QuoteDetailRepository';
import { QuoteRepository } from '../database/repositories/QuoteRepository';
import { SettingPriceBodyPartCoefficientRepository } from '../database/repositories/settings/price/SettingPriceBodyPartCoefficientRepository';
import { SettingPriceGeneralRepository } from '../database/repositories/settings/price/SettingPriceGeneralRepository';
import { SettingPriceImpactCountToUtRepository } from '../database/repositories/settings/price/SettingPriceImpactCountToUtRepository';
import { SettingPriceRepository } from '../database/repositories/settings/price/SettingPriceRepository';
import { SettingPriceTechnicityCoefficientRepository } from '../database/repositories/settings/price/SettingPriceTechnicityCoefficientRepository';
import { SubscriptionRepository } from '../database/repositories/SubscriptionRepository';
import { UserRepository } from '../database/repositories/UserRepository';
import { BrowserDownloadService } from '../download/BrowserDownloadService';
import { IClient } from '../interfaces/IClient';
import { IEmailService } from '../interfaces/IEmailService';
import { Html2PdfGenerator } from '../pdf/Html2PdfGenerator';
import { EmailService } from '../services/EmailService';
import { ISubscriptionService } from '@/@application/services/subscription/ISubscriptionService';

const container = new Container({ defaultScope: 'Singleton' });

// Managers
container.bind<IRegionManager>(SYMBOLS.Managers.regionManager).to(RegionManager).inSingletonScope();

/** 1 - CLIENTS */
container.bind<IClient>(SYMBOLS.Clients.SupabaseClient).to(SupabaseClient).inSingletonScope();

/** 2 - PROVIDERS */
container.bind<IClientProvider<SupabaseClient>>(SYMBOLS.Providers.ClientProvider).to(SupabaseClientProvider).inSingletonScope();

/** 3 - REPOSITORIES */
container.bind<IAuthRepository>(SYMBOLS.Repositories.AuthRepository).to(AuthSupabaseRepository).inSingletonScope();
container.bind<ISubscriptionRepository>(SYMBOLS.Repositories.SubscriptionRepository).to(SubscriptionRepository).inSingletonScope();
/** 3.1. -- Garage CarRepair Repository */
container.bind<IGarageRepository>(SYMBOLS.Repositories.GarageRepository).to(GarageRepository).inSingletonScope();
container.bind<IVehicleRepository>(SYMBOLS.Repositories.VehicleRepository).to(VehicleRepository).inSingletonScope();
/** 3.2. -- Settings CarRepair Repositories */
container.bind<IBodyPartRepository>(SYMBOLS.Repositories.BodyPartRepository).to(BodyPartRepository).inSingletonScope();
container.bind<IBodyMaterialRepository>(SYMBOLS.Repositories.BodyMaterialRepository).to(BodyMaterialRepository).inSingletonScope();
container.bind<IDentRepairTypeRepository>(SYMBOLS.Repositories.DentRepairTypeRepository).to(DentRepairTypeRepository).inSingletonScope();
/** 3.3 -- Settings CarRepair Repositories */
container.bind<ISettingPriceRepository>(SYMBOLS.Repositories.Setting.Price.SettingPriceRepository).to(SettingPriceRepository).inSingletonScope();
container.bind<ISettingPriceGeneralRepository>(SYMBOLS.Repositories.Setting.Price.SettingPriceGeneralRepository).to(SettingPriceGeneralRepository).inSingletonScope();
container.bind<ISettingPriceBodyPartCoefficientRepository>(SYMBOLS.Repositories.Setting.Price.SettingPriceBodyPartCoefficient).to(SettingPriceBodyPartCoefficientRepository).inSingletonScope();
container.bind<ISettingPriceTechnicityCoefficientRepository>(SYMBOLS.Repositories.Setting.Price.SettingPriceTechnicityCoefficient).to(SettingPriceTechnicityCoefficientRepository).inSingletonScope();
container.bind<ISettingPriceImpactCountToUtRepository>(SYMBOLS.Repositories.Setting.Price.SettingPriceImpactCountToUtRepository).to(SettingPriceImpactCountToUtRepository).inSingletonScope();
/** 3.4. -- User CarRepair Repositories */
container.bind<IUserRepository>(SYMBOLS.Repositories.UserRepository).to(UserRepository).inSingletonScope();
/** 3.5. -- Document Status Repositories */
container.bind<IDocumentStatusRepository>(SYMBOLS.Repositories.DocumentStatusRepository).to(DocumentStatusRepository).inSingletonScope();
/** 3.5. -- Quote Repositories */
container.bind<IQuoteRepository>(SYMBOLS.Repositories.QuoteRepository).to(QuoteRepository).inSingletonScope();
/** 3.6. -- Quote Detail Repositories */
container.bind<IQuoteDetailRepository>(SYMBOLS.Repositories.QuoteDetailRepository).to(QuoteDetailRepository).inSingletonScope();
/** 3.7. -- Invoice Repositories */
container.bind<IInvoiceRepository>(SYMBOLS.Repositories.InvoiceRepository).to(InvoiceRepository).inSingletonScope();
/** 3.8. -- Invoice Detail Repositories */
container.bind<IInvoiceDetailRepository>(SYMBOLS.Repositories.InvoiceDetailRepository).to(InvoiceDetailRepository).inSingletonScope();
/** 3.9. -- Company Settings Repository */
container.bind<ICompanySettingsRepository>(SYMBOLS.Repositories.CompanySettingsRepository).to(CompanySettingsRepository).inSingletonScope();

/** 3.10. -- Organization Repository */
container.bind<IOrganizationRepository>(SYMBOLS.Repositories.OrganizationRepository).to(OrganizationRepository).inSingletonScope();
container.bind<IOrganizationMemberRepository>(SYMBOLS.Repositories.OrganizationMemberRepository).to(OrganizationMemberRepository).inSingletonScope();

/** 4 - SERVICES */
container.bind<IAuthService>(SYMBOLS.Services.AuthService).to(AuthService).inSingletonScope();
/** 4.1. -- Garage CarRepair Services */
container.bind<IGarageService>(SYMBOLS.Services.GarageService).to(GarageService).inSingletonScope();
container.bind<IVehicleService>(SYMBOLS.Services.VehicleService).to(VehicleService).inSingletonScope();
/** 4.2. -- Settings CarRepair Services */
container.bind<IBodyPartService>(SYMBOLS.Services.BodyPartService).to(BodyPartService).inSingletonScope();
container.bind<IBodyMaterialService>(SYMBOLS.Services.BodyMaterialService).to(BodyMaterialService).inSingletonScope();
container.bind<IDentRepairTypeService>(SYMBOLS.Services.DentRepairTypeService).to(DentRepairTypeService).inSingletonScope();
/** 4.3. -- Settings CarRepair Services */
container.bind<ISettingPriceGeneralService>(SYMBOLS.Services.Setting.Price.SettingPriceGeneralService).to(SettingPriceGeneralService).inSingletonScope();
container.bind<ISettingPriceBodyPartCoefficientService>(SYMBOLS.Services.Setting.Price.SettingPriceBodyPartCoefficientService).to(SettingPriceBodyPartCoefficientService).inSingletonScope();
container.bind<ISettingPriceTechnicityCoefficientService>(SYMBOLS.Services.Setting.Price.SettingPriceTechnicityCoefficientService).to(SettingPriceTechnicityCoefficientService).inSingletonScope();
container.bind<ISettingPriceImpactCountToUtService>(SYMBOLS.Services.Setting.Price.SettingPriceImpactCountToUtService).to(SettingPriceImpactCountToUtService).inSingletonScope();
/** 4.4. -- User CarRepair Services */
container.bind<IUserService>(SYMBOLS.Services.UserService).to(UserService).inSingletonScope();
/** 4.5. -- Cost Calculator Services */
container.bind<ICostCalculatorService>(SYMBOLS.Services.CostCalculatorService).to(CostCalculatorService).inSingletonScope();
/** 4.6. -- Quote Services */
/** 4.7. -- Pdf Generator Services */
container.bind<IPdfGenerator>(SYMBOLS.Services.PdfGeneratorService).to(Html2PdfGenerator).inSingletonScope();
container.bind<IDownloadService>(SYMBOLS.Services.DownloadService).to(BrowserDownloadService);
/** 4.8. -- Email Services */
container.bind<IEmailService>(SYMBOLS.Services.EmailService).to(EmailService).inSingletonScope();
/** 4.9. -- Subscription Services */
container.bind<ISubscriptionService>(SYMBOLS.Services.SubscriptionService).to(SubscriptionService).inSingletonScope();


/** 5 - USE CASES */
container.bind<IAuthUseCase>(SYMBOLS.UseCases.Auth.Container).to(AuthUseCase).inSingletonScope();
container.bind<ILoginUseCase>(SYMBOLS.UseCases.Auth.LoginUseCase).to(LoginUseCase).inSingletonScope();
container.bind<ILogoutUseCase>(SYMBOLS.UseCases.Auth.LogoutUseCase).to(LogoutUseCase).inSingletonScope();
container.bind<IRegisterUseCase>(SYMBOLS.UseCases.Auth.RegisterUseCase).to(RegisterUseCase).inSingletonScope();
container.bind<ISubscribeToFreePlanUseCase>(SYMBOLS.UseCases.Subscription.SubscribeToFreePlanUseCase).to(SubscribeToFreePlanUseCase).inSingletonScope();
container.bind<IGetCurrentSubscriptionUseCase>(SYMBOLS.UseCases.Subscription.GetCurrentSubscriptionUseCase).to(GetCurrentSubscriptionUseCase).inSingletonScope();
/** 5.1. -- Garage CarRepair UseCases */
container.bind<IGarageUseCase>(SYMBOLS.UseCases.Garage).to(GarageUseCase).inSingletonScope();
container.bind<IVehicleUseCase>(SYMBOLS.UseCases.Vehicle).to(VehicleUseCase).inSingletonScope();
/** 5.1. -- Document Statuse UseCases */
container.bind<IGetDocumentStatusUseCase>(SYMBOLS.UseCases.GetDocumentStatus).to(GetDocumentStatusUseCase).inSingletonScope();
/** 5.2. -- Settings CarRepair UseCases */
container.bind<IBodyPartUseCase>(SYMBOLS.UseCases.CarRepair.BodyPartUseCase).to(BodyPartUseCase).inSingletonScope();
container.bind<IBodyMaterialUseCase>(SYMBOLS.UseCases.CarRepair.BodyMaterialUseCase).to(BodyMaterialUseCase).inSingletonScope();
container.bind<IDentRepairTypeUseCase>(SYMBOLS.UseCases.CarRepair.DentRepairTypeUseCase).to(DentRepairTypeUseCase).inSingletonScope();
/** 5.3. -- Settings Prices CarRepair UseCases */
container.bind<ISettingPriceUseCase>(SYMBOLS.UseCases.Setting.Price.AllUseCase).to(SettingPriceUseCase).inSingletonScope();
container.bind<ISettingPriceGeneralUseCase>(SYMBOLS.UseCases.Setting.Price.GeneralUseCase).to(SettingPriceGeneralUseCase).inSingletonScope();
container.bind<ISettingPriceBodyPartCoefficientUseCase>(SYMBOLS.UseCases.Setting.Price.BodyPartCoefficientUseCase).to(SettingPriceBodyPartCoefficientUseCase).inSingletonScope();
container.bind<ISettingPriceTechnicityCoefficientUseCase>(SYMBOLS.UseCases.Setting.Price.TechnicityCoefficientUseCase).to(SettingPriceTechnicityCoefficientUseCase).inSingletonScope();
container.bind<ISettingPriceImpactCountToUtUseCase>(SYMBOLS.UseCases.Setting.Price.ImpactCountToUtUseCase).to(SettingPriceImpactCountToUtUseCase).inSingletonScope();
/** 5.4. -- User CarRepair UseCases */
container.bind<IUserUseCase>(SYMBOLS.UseCases.UserUseCase).to(UserUseCase).inSingletonScope();
/** 5.7. -- Company Settings UseCase */
container.bind<ICompanySettingsUseCase>(SYMBOLS.UseCases.CompanySettings).to(CompanySettingsUseCase).inSingletonScope();
container.bind<ICreateUserUseCase>(SYMBOLS.UseCases.User.CreateUserUseCase).to(CreateUserUseCase).inSingletonScope();
container.bind<IRegisterUserWithOrganizationUseCase>(SYMBOLS.UseCases.User.CreateUserWithOrganizationUseCase).to(RegisterUserWithOrganizationUseCase).inSingletonScope();
/** 5.5. -- Cost Calculator UseCases */
container.bind<ICalculateLineCostUseCase>(SYMBOLS.UseCases.CostCalculator.CalculateLineCostUseCase).to(CalculateLineCostUseCase).inSingletonScope();
container.bind<ICalculateTotalCostUseCase>(SYMBOLS.UseCases.CostCalculator.CalculateTotalCostUseCase).to(CalculateTotalCostUseCase).inSingletonScope();
/** 5.6. -- Quote UseCases */
// container.bind<IQuoteUseCase>(SYMBOLS.UseCases.Quote.QuoteUseCase).to(QuoteUseCase).inSingletonScope();
container.bind<IQuotesUseCase>(SYMBOLS.UseCases.Quote.GetQuotesUseCase).to(GetQuotesUseCase).inSingletonScope();
container.bind<IViewQuoteUseCase>(SYMBOLS.UseCases.Quote.ViewQuoteUseCase).to(ViewQuoteUseCase).inSingletonScope();
container.bind<ICreateQuoteUseCase>(SYMBOLS.UseCases.Quote.CreateQuoteUseCase).to(CreateQuoteUseCase).inSingletonScope();
container.bind<IInsertQuoteUseCase>(SYMBOLS.UseCases.Quote.InsertQuoteUseCase).to(InsertQuoteUseCase).inSingletonScope();
container.bind<IUpdateQuoteUseCase>(SYMBOLS.UseCases.Quote.UpdateQuoteUseCase).to(UpdateQuoteUseCase).inSingletonScope();
container.bind<IDeleteQuoteUseCase>(SYMBOLS.UseCases.Quote.DeleteQuoteUseCase).to(DeleteQuoteUseCase).inSingletonScope();
container.bind<IGetQuoteUseCase>(SYMBOLS.UseCases.Quote.GetQuoteUseCase).to(GetQuoteUseCase).inSingletonScope();
container.bind<IGetQuoteDetailUseCase>(SYMBOLS.UseCases.Quote.GetQuoteDetailsUseCase).to(GetQuoteDetailUseCase).inSingletonScope();
container.bind<IUpdateStatusQuoteUseCase>(SYMBOLS.UseCases.Quote.UpdateStatusQuoteUseCase).to(UpdateStatusQuoteUseCase).inSingletonScope();
container.bind<IAddQuoteLineItemUseCase>(SYMBOLS.UseCases.Quote.AddLineItemUseCase).to(AddQuoteLineItemUseCase).inSingletonScope();
container.bind<IDeleteLineItemUseCase>(SYMBOLS.UseCases.Quote.DeleteLineItemUseCase).to(DeleteLineItemUseCase).inSingletonScope();
container.bind<IGenerateQuotePdfUseCase>(SYMBOLS.UseCases.Quote.GenerateQuotePdfUseCase).to(GenerateQuotePdfUseCase).inSingletonScope();
container.bind<ISendQuoteUseCase>(SYMBOLS.UseCases.Quote.SendQuoteUseCase).to(SendQuoteUseCase);
container.bind<IDuplicateQuoteToInvoiceUseCase>(SYMBOLS.UseCases.Quote.DuplicateQuoteToInvoiceUseCase).to(DuplicateQuoteToInvoiceUseCase).inSingletonScope();
/** 5.6. -- Invoice UseCases */
// container.bind<IInvoiceUseCase>(SYMBOLS.UseCases.Invoice.InvoiceUseCase).to(InvoiceUseCase).inSingletonScope();
container.bind<IInvoicesUseCase>(SYMBOLS.UseCases.Invoice.GetInvoicesUseCase).to(GetInvoicesUseCase).inSingletonScope();
container.bind<IViewInvoiceUseCase>(SYMBOLS.UseCases.Invoice.ViewInvoiceUseCase).to(ViewInvoiceUseCase).inSingletonScope();
container.bind<ICreateInvoiceUseCase>(SYMBOLS.UseCases.Invoice.CreateInvoiceUseCase).to(CreateInvoiceUseCase).inSingletonScope();
container.bind<IInsertInvoiceUseCase>(SYMBOLS.UseCases.Invoice.InsertInvoiceUseCase).to(InsertInvoiceUseCase).inSingletonScope();
container.bind<IUpdateInvoiceUseCase>(SYMBOLS.UseCases.Invoice.UpdateInvoiceUseCase).to(UpdateInvoiceUseCase).inSingletonScope();
container.bind<IDeleteInvoiceUseCase>(SYMBOLS.UseCases.Invoice.DeleteInvoiceUseCase).to(DeleteInvoiceUseCase).inSingletonScope();
container.bind<IGetInvoiceUseCase>(SYMBOLS.UseCases.Invoice.GetInvoiceUseCase).to(GetInvoiceUseCase).inSingletonScope();
container.bind<IGetInvoiceDetailUseCase>(SYMBOLS.UseCases.Invoice.GetInvoiceDetailsUseCase).to(GetInvoiceDetailUseCase).inSingletonScope();
// container.bind<ISaveInvoiceUseCase>(SYMBOLS.UseCases.Invoice.SaveInvoiceUseCase).to(SaveInvoiceUseCase).inSingletonScope();
container.bind<IAddInvoiceLineItemUseCase>(SYMBOLS.UseCases.Invoice.AddLineItemUseCase).to(AddInvoiceLineItemUseCase).inSingletonScope();
// container.bind<IDeleteLineItemUseCase>(SYMBOLS.UseCases.Invoice.DeleteLineItemUseCase).to(DeleteLineItemUseCase).inSingletonScope();
container.bind<IGenerateInvoicePdfUseCase>(SYMBOLS.UseCases.Invoice.GenerateInvoicePdfUseCase).to(GenerateInvoicePdfUseCase).inSingletonScope();
container.bind<ISendInvoiceUseCase>(SYMBOLS.UseCases.Invoice.SendInvoiceUseCase).to(SendInvoiceUseCase);



/** 6 - STATES */
container.bind<IAuthState>(SYMBOLS.States.AuthState).to(AuthState).inSingletonScope();
container.bind<ISubscriptionState>(SYMBOLS.States.SubscriptionState).to(SubscriptionState).inSingletonScope();
/** 6.0. -- Company Settings State */
container.bind<IUseCompanySettingsState>(SYMBOLS.States.CompanySettingsState).toDynamicValue(() => {
  return useCompanySettingsState();
});
/** 6.0. -- Profile State */
container.bind<IUseProfileState>(SYMBOLS.States.ProfileState).toDynamicValue(() => {
  return useProfileState();
});
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
container.bind<IUseSettingPriceBodyPartCoefficientState>(SYMBOLS.States.Setting.Price.BodyPartCoefficientState).toDynamicValue(() => {
  return useSettingPriceBodyPartCoefficientState();
});
container.bind<IUseSettingPriceTechnicityCoefficientState>(SYMBOLS.States.Setting.Price.TechnicityCoefficientState).toDynamicValue(() => {
  return useSettingPriceTechnicityCoefficientState();
});
container.bind<IUseSettingPriceImpactCountToUtState>(SYMBOLS.States.Setting.Price.ImpactCountToUtState).toDynamicValue(() => {
  return useSettingPriceImpactCountToUtState();
});
/** 6.3. -- Quote States */
container.bind<IUseCreateQuoteState>(SYMBOLS.States.Quote.CreateQuoteState).toDynamicValue(() => {
  return useCreateQuoteState();
});
container.bind<IUseViewQuoteState>(SYMBOLS.States.Quote.ViewQuoteState).toDynamicValue(() => {
  return useViewQuoteState();
});
container.bind<IUseEditQuoteState>(SYMBOLS.States.Quote.EditQuoteState).toDynamicValue(() => {
  return useEditQuoteState();
});
container.bind<IUseQuotesState>(SYMBOLS.States.Quote.GetQuotesUseCase).toDynamicValue(() => {
  return useQuotesState();
});
/** 6.4. -- Invoice States */
container.bind<IUseCreateInvoiceState>(SYMBOLS.States.Invoice.CreateInvoiceState).toDynamicValue(() => {
  return useCreateInvoiceState();
});
container.bind<IUseViewInvoiceState>(SYMBOLS.States.Invoice.ViewInvoiceState).toDynamicValue(() => {
  return useViewInvoiceState();
});
container.bind<IUseEditInvoiceState>(SYMBOLS.States.Invoice.EditInvoiceState).toDynamicValue(() => {
  return useEditInvoiceState();
});
container.bind<IUseInvoicesState>(SYMBOLS.States.Invoice.GetInvoicesUseCase).toDynamicValue(() => {
  return useInvoicesState();
});

export { container };

