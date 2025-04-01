import { SYMBOL_NAMES } from "./symbolTypes";

const SYMBOLS = {
  Clients: {
    SupabaseClient: Symbol.for(SYMBOL_NAMES.SUPABASE_CLIENT),
  },
  Providers: {
    ClientProvider: Symbol.for(SYMBOL_NAMES.CLIENT_PROVIDER),
  },
  Repositories: {
    AuthRepository: Symbol.for(SYMBOL_NAMES.AUTH_REPOSITORY),
    UserRepository: Symbol.for(SYMBOL_NAMES.USER_REPOSITORY),
    GarageRepository: Symbol.for(SYMBOL_NAMES.GARAGE_REPOSITORY),
    InvoiceRepository: Symbol.for(SYMBOL_NAMES.INVOICE_REPOSITORY),
    QuoteRepository: Symbol.for(SYMBOL_NAMES.QUOTE_REPOSITORY),
    // -- Settings CarRepair Repositories
    BodyPartRepository: Symbol.for(SYMBOL_NAMES.BODY_PART_REPOSITORY),
    BodyMaterialRepository: Symbol.for(SYMBOL_NAMES.BODY_MATERIAL_REPOSITORY),
    DentRepairTypeRepository: Symbol.for(SYMBOL_NAMES.DENT_REPAIR_TYPE_REPOSITORY),
    // -- Settings Prices CarRepair Repositories
    Setting: {
      Price: {
        SettingPriceGeneralRepository: Symbol.for(SYMBOL_NAMES.SETTING_PRICE_GENERAL_REPOSITORY),
        SettingPriceImpactCountToUtRepository: Symbol.for(SYMBOL_NAMES.SETTING_PRICE_IMPACT_COUNT_TO_UT_REPOSITORY),
        SettingPriceBodyMaterialCoefficient: Symbol.for(SYMBOL_NAMES.SETTING_PRICE_BODY_MATERIAL_COEFFICIENT),
        SettingPriceBodyPartCoefficient: Symbol.for(SYMBOL_NAMES.SETTING_PRICE_BODY_PART_COEFFICIENT),
        SettingPriceDiameterCoefficient: Symbol.for(SYMBOL_NAMES.SETTING_PRICE_DIAMETER_COEFFICIENT),
        RepairTypeCoefficient: Symbol.for(SYMBOL_NAMES.SETTING_PRICE_REPAIR_TYPE_COEFFICIENT),
      }
    }
  },
  Services: {
    AuthService: Symbol.for(SYMBOL_NAMES.AUTH_SERVICE),
    UserService: Symbol.for(SYMBOL_NAMES.USER_SERVICE),
    GarageService: Symbol.for(SYMBOL_NAMES.GARAGE_SERVICE),
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
        SettingPriceBodyMaterialCoefficientService: Symbol.for(SYMBOL_NAMES.SETTING_PRICE_BODY_MATERIAL_COEFFICIENT_SERVICE),
        SettingPriceBodyPartCoefficientService: Symbol.for(SYMBOL_NAMES.SETTING_PRICE_BODY_PART_COEFFICIENT_SERVICE),
        SettingPriceDiameterCoefficientService: Symbol.for(SYMBOL_NAMES.SETTING_PRICE_DIAMETER_COEFFICIENT_SERVICE),
      }
    },
  },
  UseCases: {
    Auth: {
      Container: Symbol.for(SYMBOL_NAMES.AUTH_USE_CASE),
      LoginUseCase: Symbol.for(SYMBOL_NAMES.LOGIN_USE_CASE),
      LogoutUseCase: Symbol.for(SYMBOL_NAMES.LOGOUT_USE_CASE),
      RegisterUseCase: Symbol.for(SYMBOL_NAMES.REGISTER_USE_CASE),
    },
    // -- User UseCases
    UserUseCase: Symbol.for(SYMBOL_NAMES.USER_USE_CASE),
    Garage: Symbol.for(SYMBOL_NAMES.GARAGE_USE_CASE),
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
        BodyMaterialCoefficientUseCase: Symbol.for(SYMBOL_NAMES.SETTING_PRICE_BODY_MATERIAL_COEFFICIENT_USE_CASE),
        BodyPartCoefficientUseCase: Symbol.for(SYMBOL_NAMES.SETTING_PRICE_BODY_PART_COEFFICIENT_USE_CASE),
        DiameterCoefficientUseCase: Symbol.for(SYMBOL_NAMES.SETTING_PRICE_DIAMETER_COEFFICIENT_USE_CASE),
        RepairTypeCoefficientUseCase: Symbol.for(SYMBOL_NAMES.SETTING_PRICE_REPAIR_TYPE_COEFFICIENT_USE_CASE),
      }
    },
    CostCalculator: {
      CalculateTotalCostUseCase: Symbol.for(SYMBOL_NAMES.CALCULATE_TOTAL_COST_USE_CASE),
      CalculateLineCostUseCase: Symbol.for(SYMBOL_NAMES.CALCULATE_LINE_COST_USE_CASE),
    },
    Quote: {
      QuoteUseCase: Symbol.for(SYMBOL_NAMES.QUOTE_USE_CASE),
      GetQuoteUseCase: Symbol.for(SYMBOL_NAMES.GET_QUOTE_USE_CASE),
      GetQuotesUseCase: Symbol.for(SYMBOL_NAMES.GET_QUOTES_USE_CASE),
      GetQuoteDetailsUseCase: Symbol.for(SYMBOL_NAMES.GET_QUOTE_DETAILS_USE_CASE),
      CreateQuoteUseCase: Symbol.for(SYMBOL_NAMES.CREATE_QUOTE_USE_CASE),
      InsertQuoteUseCase: Symbol.for(SYMBOL_NAMES.INSERT_QUOTE_USE_CASE),
      AddLineItemUseCase: Symbol.for(SYMBOL_NAMES.ADD_QUOTE_LINE_ITEM_USE_CASE),
      SaveQuoteUseCase: Symbol.for(SYMBOL_NAMES.SAVE_QUOTE_USE_CASE),
      DeleteQuoteUseCase: Symbol.for(SYMBOL_NAMES.DELETE_QUOTE_USE_CASE),
    }
  },
  States: {
    AuthState: Symbol.for(SYMBOL_NAMES.AUTH_STATE),
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
        BodyMaterialCoefficientState: Symbol.for(SYMBOL_NAMES.SETTING_PRICE_BODY_MATERIAL_COEFFICIENT_STATE),
        BodyPartCoefficientState: Symbol.for(SYMBOL_NAMES.SETTING_PRICE_BODY_PART_COEFFICIENT_STATE),
        DiameterCoefficientState: Symbol.for(SYMBOL_NAMES.SETTING_PRICE_DIAMETER_COEFFICIENT_STATE),
        RepairTypeCoefficientState: Symbol.for(SYMBOL_NAMES.SETTING_PRICE_REPAIR_TYPE_COEFFICIENT_STATE),
      }
    },
    // -- Quotes States
    Quote: {
      QuoteState: Symbol.for(SYMBOL_NAMES.QUOTE_STATE),
      GetQuotesUseCase: Symbol.for(SYMBOL_NAMES.GET_QUOTES_STATE),
      CreateQuoteState: Symbol.for(SYMBOL_NAMES.CREATE_QUOTE_STATE),
    }
  },
};

export { SYMBOLS };

