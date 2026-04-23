// TODO: (GCE) -> TO BE MOVED TO CORE

import { SYMBOL_NAMES } from "./symbolTypes";

const SYMBOLS = {
  Managers: {
    regionManager: Symbol.for(SYMBOL_NAMES.REGION_MANAGER)
  },
  Clients: {
    SupabaseClient: Symbol.for(SYMBOL_NAMES.SUPABASE_CLIENT),
  },
  Providers: {
    ClientProvider: Symbol.for(SYMBOL_NAMES.CLIENT_PROVIDER),
  },
  Repositories: {
    AuthRepository: Symbol.for(SYMBOL_NAMES.AUTH_REPOSITORY),
    UserRepository: Symbol.for(SYMBOL_NAMES.USER_REPOSITORY),
    // Subscription Repositories
    SubscriptionRepository: Symbol.for(SYMBOL_NAMES.SUBSCRIPTION_REPOSITORY),
    GarageRepository: Symbol.for(SYMBOL_NAMES.GARAGE_REPOSITORY),
    VehicleRepository: Symbol.for(SYMBOL_NAMES.VEHICLE_REPOSITORY),
    
    // Document Status Repositories
    DocumentStatusRepository: Symbol.for(SYMBOL_NAMES.DOCUMENT_STATUS_REPOSITORY),

    InvoiceRepository: Symbol.for(SYMBOL_NAMES.INVOICE_REPOSITORY),
    InvoiceDetailRepository: Symbol.for(SYMBOL_NAMES.INVOICE_DETAIL_REPOSITORY),
    QuoteRepository: Symbol.for(SYMBOL_NAMES.QUOTE_REPOSITORY),
    QuoteDetailRepository: Symbol.for(SYMBOL_NAMES.QUOTE_DETAIL_REPOSITORY),
    CompanySettingsRepository: Symbol.for(SYMBOL_NAMES.COMPANY_SETTINGS_REPOSITORY),
    // -- Settings CarRepair Repositories
    BodyPartRepository: Symbol.for(SYMBOL_NAMES.BODY_PART_REPOSITORY),
    BodyMaterialRepository: Symbol.for(SYMBOL_NAMES.BODY_MATERIAL_REPOSITORY),
    DentRepairTypeRepository: Symbol.for(SYMBOL_NAMES.DENT_REPAIR_TYPE_REPOSITORY),
    // -- Settings Prices CarRepair Repositories
    Setting: {
      Price: {
        SettingPriceRepository: Symbol.for(SYMBOL_NAMES.SETTING_PRICE_REPOSITORY),
        SettingPriceGeneralRepository: Symbol.for(SYMBOL_NAMES.SETTING_PRICE_GENERAL_REPOSITORY),
        SettingPriceImpactCountToUtRepository: Symbol.for(SYMBOL_NAMES.SETTING_PRICE_IMPACT_COUNT_TO_UT_REPOSITORY),
        SettingPriceBodyPartCoefficient: Symbol.for(SYMBOL_NAMES.SETTING_PRICE_BODY_PART_COEFFICIENT),
        SettingPriceTechnicityCoefficient: Symbol.for(SYMBOL_NAMES.SETTING_PRICE_TECHNICITY_COEFFICIENT_REPOSITORY),
      }
    }
  },
  Services: {
    AuthService: Symbol.for(SYMBOL_NAMES.AUTH_SERVICE),
    UserService: Symbol.for(SYMBOL_NAMES.USER_SERVICE),
    GarageService: Symbol.for(SYMBOL_NAMES.GARAGE_SERVICE),
    VehicleService: Symbol.for(SYMBOL_NAMES.VEHICLE_SERVICE),
    NotificationService: Symbol.for(SYMBOL_NAMES.NOTIFICATION_SERVICE),
    CostCalculatorService: Symbol.for(SYMBOL_NAMES.COST_CALCULATOR_SERVICE),
    // -- Settings CarRepair Services
    BodyPartService: Symbol.for(SYMBOL_NAMES.BODY_PART_SERVICE),
    BodyMaterialService: Symbol.for(SYMBOL_NAMES.BODY_MATERIAL_SERVICE),
    DentRepairTypeService: Symbol.for(SYMBOL_NAMES.DENT_REPAIR_TYPE_SERVICE),
    // -- Settings Prices CarRepair Services
    Setting: {
      Price: {
        SettingPriceGeneralService: Symbol.for(SYMBOL_NAMES.SETTING_PRICE_GENERAL_SERVICE),
        SettingPriceImpactCountToUtService: Symbol.for(SYMBOL_NAMES.SETTING_PRICE_IMPACT_COUNT_TO_UT_SERVICE),
        SettingPriceBodyPartCoefficientService: Symbol.for(SYMBOL_NAMES.SETTING_PRICE_BODY_PART_COEFFICIENT_SERVICE),
        SettingPriceTechnicityCoefficientService: Symbol.for(SYMBOL_NAMES.SETTING_PRICE_TECHNICITY_COEFFICIENT_SERVICE),
      }
    },
    PdfGeneratorService: Symbol.for(SYMBOL_NAMES.PDF_GENERATOR_SERVICE),
    DownloadService: Symbol.for(SYMBOL_NAMES.DOWNLOAD_SERVICE),
    EmailService: Symbol.for(SYMBOL_NAMES.EMAIL_SERVICE),
  },
  UseCases: {
    Auth: {
      Container: Symbol.for(SYMBOL_NAMES.AUTH_USE_CASE),
      LoginUseCase: Symbol.for(SYMBOL_NAMES.LOGIN_USE_CASE),
      LogoutUseCase: Symbol.for(SYMBOL_NAMES.LOGOUT_USE_CASE),
      RegisterUseCase: Symbol.for(SYMBOL_NAMES.REGISTER_USE_CASE),
    },
    // -- Subscription UseCases
    Subscription: {
      SubscribeToFreePlanUseCase: Symbol.for(SYMBOL_NAMES.SUBSCRIBE_TO_FREE_PLAN_USE_CASE),
      GetCurrentSubscriptionUseCase: Symbol.for(SYMBOL_NAMES.GET_CURRENT_SUBSCRIPTION_USE_CASE),
    },
    // -- User UseCases
    UserUseCase: Symbol.for(SYMBOL_NAMES.USER_USE_CASE),
    User: {
      CreateUserUseCase: Symbol.for(SYMBOL_NAMES.CREATE_USER_USE_CASE),
    },
    Garage: Symbol.for(SYMBOL_NAMES.GARAGE_USE_CASE),
    Vehicle: Symbol.for(SYMBOL_NAMES.VEHICLE_USE_CASE),
    GetDocumentStatus: Symbol.for(SYMBOL_NAMES.GET_DOCUMENT_STATUS_USE_CASE),

    CarRepair: {
      BodyPartUseCase: Symbol.for(SYMBOL_NAMES.BODY_PART_USE_CASE),
      BodyMaterialUseCase: Symbol.for(SYMBOL_NAMES.BODY_MATERIAL_USE_CASE),
      DentRepairTypeUseCase: Symbol.for(SYMBOL_NAMES.DENT_REPAIR_TYPE_USE_CASE),
    },
    // -- Settings Prices CarRepair UseCases
    Setting: {
      Price: {
        AllUseCase: Symbol.for(SYMBOL_NAMES.SETTING_PRICE_USE_CASE),
        GeneralUseCase: Symbol.for(SYMBOL_NAMES.SETTING_PRICE_GENERAL_USE_CASE),
        ImpactCountToUtUseCase: Symbol.for(SYMBOL_NAMES.SETTING_PRICE_IMPACT_COUNT_TO_UT_USE_CASE),
        BodyPartCoefficientUseCase: Symbol.for(SYMBOL_NAMES.SETTING_PRICE_BODY_PART_COEFFICIENT_USE_CASE),
        TechnicityCoefficientUseCase: Symbol.for(SYMBOL_NAMES.SETTING_PRICE_TECHNICITY_COEFFICIENT_USE_CASE),
      }
    },
    CostCalculator: {
      CalculateTotalCostUseCase: Symbol.for(SYMBOL_NAMES.CALCULATE_TOTAL_COST_USE_CASE),
      CalculateLineCostUseCase: Symbol.for(SYMBOL_NAMES.CALCULATE_LINE_COST_USE_CASE),
    },
    CompanySettings: Symbol.for(SYMBOL_NAMES.COMPANY_SETTINGS_USE_CASE),
    Quote: {
      QuoteUseCase: Symbol.for(SYMBOL_NAMES.QUOTE_USE_CASE),
      GetQuoteUseCase: Symbol.for(SYMBOL_NAMES.GET_QUOTE_USE_CASE),
      GetQuotesUseCase: Symbol.for(SYMBOL_NAMES.GET_QUOTES_USE_CASE),
      ViewQuoteUseCase: Symbol.for(SYMBOL_NAMES.VIEW_QUOTE_USE_CASE),
      CreateQuoteUseCase: Symbol.for(SYMBOL_NAMES.CREATE_QUOTE_USE_CASE),
      InsertQuoteUseCase: Symbol.for(SYMBOL_NAMES.INSERT_QUOTE_USE_CASE),
      UpdateQuoteUseCase: Symbol.for(SYMBOL_NAMES.UPDATE_QUOTE_USE_CASE),
      UpdateStatusQuoteUseCase: Symbol.for(SYMBOL_NAMES.UPDATE_STATUS_QUOTE_USE_CASE),
      DeleteQuoteUseCase: Symbol.for(SYMBOL_NAMES.DELETE_QUOTE_USE_CASE),
      DuplicateQuoteToInvoiceUseCase: Symbol.for(SYMBOL_NAMES.DUPLICATE_QUOTE_TO_INVOICE),
      
      GetQuoteDetailsUseCase: Symbol.for(SYMBOL_NAMES.GET_QUOTE_DETAILS_USE_CASE),
      // AddQuoteDetailsUseCase: Symbol.for(SYMBOL_NAMES.ADD_QUOTE_DETAILS_USE_CASE),
      AddLineItemUseCase: Symbol.for(SYMBOL_NAMES.ADD_QUOTE_LINE_ITEM_USE_CASE),
      DeleteLineItemUseCase: Symbol.for(SYMBOL_NAMES.DELETE_LINE_ITEM_USE_CASE),
      // -- Pdf UseCases
      GenerateQuotePdfUseCase: Symbol.for(SYMBOL_NAMES.GENERATE_QUOTE_PDF_USE_CASE),
      SendQuoteUseCase: Symbol.for(SYMBOL_NAMES.SEND_QUOTE_USE_CASE),
    },
    Invoice: {
      InvoiceUseCase: Symbol.for(SYMBOL_NAMES.INVOICE_USE_CASE),
      GetInvoiceUseCase: Symbol.for(SYMBOL_NAMES.GET_INVOICE_USE_CASE),
      GetInvoicesUseCase: Symbol.for(SYMBOL_NAMES.GET_INVOICES_USE_CASE),
      ViewInvoiceUseCase: Symbol.for(SYMBOL_NAMES.VIEW_INVOICE_USE_CASE),
      CreateInvoiceUseCase: Symbol.for(SYMBOL_NAMES.CREATE_INVOICE_USE_CASE),
      InsertInvoiceUseCase: Symbol.for(SYMBOL_NAMES.INSERT_INVOICE_USE_CASE),
      UpdateInvoiceUseCase: Symbol.for(SYMBOL_NAMES.UPDATE_INVOICE_USE_CASE),
      SaveInvoiceUseCase: Symbol.for(SYMBOL_NAMES.SAVE_INVOICE_USE_CASE),
      DeleteInvoiceUseCase: Symbol.for(SYMBOL_NAMES.DELETE_INVOICE_USE_CASE),
      
      GetInvoiceDetailsUseCase: Symbol.for(SYMBOL_NAMES.GET_INVOICE_DETAILS_USE_CASE),
      // AddInvoiceDetailsUseCase: Symbol.for(SYMBOL_NAMES.ADD_INVOICE_DETAILS_USE_CASE),
      AddLineItemUseCase: Symbol.for(SYMBOL_NAMES.ADD_INVOICE_LINE_ITEM_USE_CASE),
      DeleteLineItemUseCase: Symbol.for(SYMBOL_NAMES.DELETE_LINE_ITEM_USE_CASE),
      // -- Pdf UseCases
      GenerateInvoicePdfUseCase: Symbol.for(SYMBOL_NAMES.GENERATE_INVOICE_PDF_USE_CASE),
      SendInvoiceUseCase: Symbol.for(SYMBOL_NAMES.SEND_INVOICE_USE_CASE),
    },
  },
  States: {
    AuthState: Symbol.for(SYMBOL_NAMES.AUTH_STATE),
    SubscriptionState: Symbol.for(SYMBOL_NAMES.SUBSCRIPTION_STATE),
    // -- User States
    UserState: Symbol.for(SYMBOL_NAMES.USER_STATE),
    // -- Garage States
    GarageState: Symbol.for(SYMBOL_NAMES.GARAGE_STATE),
    // -- Settings CarRepair States
    CarRepair: {
      BodyPartState: Symbol.for(SYMBOL_NAMES.BODY_PART_STATE),
      BodyMaterialState: Symbol.for(SYMBOL_NAMES.BODY_MATERIAL_STATE),
      DentRepairTypeState: Symbol.for(SYMBOL_NAMES.DENT_REPAIR_TYPE_STATE),
      DentRemovalPricingState: Symbol.for(SYMBOL_NAMES.DENT_REMOVAL_PRICING_STATE),
    },
    // -- Settings Prices CarRepair States
    Setting: {
      Price: {
        All: Symbol.for(SYMBOL_NAMES.SETTING_PRICE_STATE),
        GeneralState: Symbol.for(SYMBOL_NAMES.SETTING_PRICE_GENERAL_STATE),
        ImpactCountToUtState: Symbol.for(SYMBOL_NAMES.SETTING_PRICE_IMPACT_COUNT_TO_UT_STATE),
        BodyPartCoefficientState: Symbol.for(SYMBOL_NAMES.SETTING_PRICE_BODY_PART_COEFFICIENT_STATE),
        TechnicityCoefficientState: Symbol.for(SYMBOL_NAMES.SETTING_PRICE_TECHNICITY_COEFFICIENT_STATE),
      }
    },
    // -- Quotes States
    Quote: {
      QuoteState: Symbol.for(SYMBOL_NAMES.QUOTE_STATE),
      ViewQuoteState: Symbol.for(SYMBOL_NAMES.VIEW_QUOTE_STATE),
      CreateQuoteState: Symbol.for(SYMBOL_NAMES.CREATE_QUOTE_STATE),
      EditQuoteState: Symbol.for(SYMBOL_NAMES.EDIT_QUOTE_STATE),
      GetQuotesUseCase: Symbol.for(SYMBOL_NAMES.GET_QUOTES_STATE),
    },
    // -- Company Settings State
    CompanySettingsState: Symbol.for(SYMBOL_NAMES.COMPANY_SETTINGS_STATE),
    // -- Profile State
    ProfileState: Symbol.for(SYMBOL_NAMES.PROFILE_STATE),
    // -- Invoices States
    Invoice: {
      InvoiceState: Symbol.for(SYMBOL_NAMES.INVOICE_STATE),
      ViewInvoiceState: Symbol.for(SYMBOL_NAMES.VIEW_INVOICE_STATE),
      CreateInvoiceState: Symbol.for(SYMBOL_NAMES.CREATE_INVOICE_STATE),
      EditInvoiceState: Symbol.for(SYMBOL_NAMES.EDIT_INVOICE_STATE),
      GetInvoicesUseCase: Symbol.for(SYMBOL_NAMES.GET_INVOICES_STATE),
    }
  },
};

export { SYMBOLS };

