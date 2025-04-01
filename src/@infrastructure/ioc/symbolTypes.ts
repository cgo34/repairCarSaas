export enum SYMBOL_NAMES {
    // Clients
    SUPABASE_CLIENT = 'SupabaseClient',

    // Providers
    CLIENT_PROVIDER = 'ClientProvider',

    // #region -> REPOSITORIES
    AUTH_REPOSITORY = 'AuthRepository',
    USER_REPOSITORY = 'UserRepository',
    GARAGE_REPOSITORY = 'GarageRepository',
    INVOICE_REPOSITORY = 'InvoiceRepository',
    QUOTE_REPOSITORY = 'QuoteRepository',
    // Settings CarRepair Repositories
    BODY_PART_REPOSITORY = 'BodyPartRepository',
    BODY_MATERIAL_REPOSITORY = 'BodyMaterialRepository',
    DENT_REPAIR_TYPE_REPOSITORY = 'DentRepairTypeRepository',
    // -- Settings Prices CarRepair Repositories
    SETTING_PRICE_GENERAL_REPOSITORY = 'SettingPriceGeneralRepository',
    SETTING_PRICE_IMPACT_COUNT_TO_UT_REPOSITORY = 'SettingPriceImpactCountToUtRepository',
    SETTING_PRICE_BODY_MATERIAL_COEFFICIENT = 'SettingPriceBodyMaterialCoefficient',
    SETTING_PRICE_BODY_PART_COEFFICIENT = 'SettingPriceBodyPartCoefficient',
    SETTING_PRICE_DIAMETER_COEFFICIENT = 'SettingPriceDiameterCoefficient',
    SETTING_PRICE_REPAIR_TYPE_COEFFICIENT = 'SettingPriceRepairTypeCoefficient',
    // #endregion

    // #region -> SERVICES
    AUTH_SERVICE = 'AuthService',
    USER_SERVICE = 'UserService',
    GARAGE_SERVICE = 'GarageService',
    NOTIFICATION_SERVICE = 'NotificationService',
    COST_CALCULATOR_SERVICE = 'CostCalculatorService',
    // Settings CarRepair Services
    BODY_PART_SERVICE = 'BodyPartService',
    BODY_MATERIAL_SERVICE = 'BodyMaterialService',
    DENT_REPAIR_TYPE_SERVICE = 'DentRepairTypeService',
    DENT_REMOVAL_PRICING_SERVICE = 'DentRemovalPricingService',
    // -- Settings Prices CarRepair Services
    SETTING_PRICE_GENERAL_SERVICE = 'SettingPriceGeneralService',
    SETTING_PRICE_IMPACT_COUNT_TO_UT_SERVICE = 'SettingPriceImpactCountToUtService',
    SETTING_PRICE_BODY_MATERIAL_COEFFICIENT_SERVICE = 'SettingPriceBodyMaterialCoefficientService',
    SETTING_PRICE_BODY_PART_COEFFICIENT_SERVICE = 'SettingPriceBodyPartCoefficientService',
    SETTING_PRICE_DIAMETER_COEFFICIENT_SERVICE = 'SettingPriceDiameterCoefficientService',
    // #endregion
  
    // #region -> USE CASES
    // -- Auth UseCases
    AUTH_USE_CASE = 'AuthUseCase',
    LOGIN_USE_CASE = 'LoginUseCase',
    LOGOUT_USE_CASE = 'LogoutUseCase',
    REGISTER_USE_CASE = 'RegisterUseCase',
    // -- User UseCases
    USER_USE_CASE = 'UserUseCase',
    // -- Garage UseCases
    GARAGE_USE_CASE = 'GarageUseCase',
    // -- Settings CarRepair UseCases
    BODY_PART_USE_CASE = 'BodyPartUseCase',
    BODY_MATERIAL_USE_CASE = 'BodyMaterialUseCase',
    DENT_REPAIR_TYPE_USE_CASE = 'DentRepairTypeUseCase',
    // -- Settings Prices CarRepair UseCases
    SETTING_PRICE_USE_CASE = 'SettingPriceUseCase',
    SETTING_PRICE_GENERAL_USE_CASE = 'SettingPriceGeneralUseCase',
    SETTING_PRICE_IMPACT_COUNT_TO_UT_USE_CASE = 'SettingPriceImpactCountToUtUseCase',
    SETTING_PRICE_BODY_MATERIAL_COEFFICIENT_USE_CASE = 'SettingPriceBodyMaterialCoefficientUseCase',
    SETTING_PRICE_BODY_PART_COEFFICIENT_USE_CASE = 'SettingPriceBodyPartCoefficientUseCase',
    SETTING_PRICE_DIAMETER_COEFFICIENT_USE_CASE = 'SettingPriceDiameterCoefficientUseCase',
    SETTING_PRICE_REPAIR_TYPE_COEFFICIENT_USE_CASE = 'SettingPriceRepairTypeCoefficientUseCase',
    // -- Cost Calculator UseCases
    CALCULATE_TOTAL_COST_USE_CASE = 'CalculateTotalCostUseCase',
    CALCULATE_LINE_COST_USE_CASE = 'CalculateLineCostUseCase',
    // -- Quote UseCases
    QUOTE_USE_CASE = 'QuoteUseCase',
    GET_QUOTE_USE_CASE = 'GetQuoteUseCase',
    GET_QUOTES_USE_CASE = 'GetQuotesUseCase',
    GET_QUOTE_DETAILS_USE_CASE = 'GetQuoteDetailsUseCase',
    CREATE_QUOTE_USE_CASE = 'CreateQuoteUseCase',
    INSERT_QUOTE_USE_CASE = 'InsertQuoteUseCase',
    ADD_QUOTE_LINE_ITEM_USE_CASE = 'AddQuoteLineItemUseCase',
    SAVE_QUOTE_USE_CASE = 'SaveQuoteUseCase',
    DELETE_QUOTE_USE_CASE = 'DeleteQuoteUseCase',
    // #endregion

    // #region -> STATES
    AUTH_STATE = 'AuthState',
    // -- User States
    USER_STATE = 'UserState',
    // -- Garage States
    GARAGE_STATE = 'GarageState',
    // -- Settings CarRepair States
    BODY_PART_STATE = 'BodyPartState',
    BODY_MATERIAL_STATE = 'BodyMaterialState',
    DENT_REPAIR_TYPE_STATE = 'DentRepairTypeState',
    DENT_REMOVAL_PRICING_STATE = 'DentRemovalPricingState',
    // -- Settings Prices CarRepair States
    SETTING_PRICE_STATE = 'SettingPriceState',
    SETTING_PRICE_GENERAL_STATE = 'SettingPriceGeneralState',
    SETTING_PRICE_IMPACT_COUNT_TO_UT_STATE = 'SettingPriceImpactCountToUtState',
    SETTING_PRICE_BODY_MATERIAL_COEFFICIENT_STATE = 'SettingPriceBodyMaterialCoefficientState',
    SETTING_PRICE_BODY_PART_COEFFICIENT_STATE = 'SettingPriceBodyPartCoefficientState',
    SETTING_PRICE_DIAMETER_COEFFICIENT_STATE = 'SettingPriceDiameterCoefficientState',
    SETTING_PRICE_REPAIR_TYPE_COEFFICIENT_STATE = 'SettingPriceRepairTypeCoefficientState',
    // -- Quote States
    QUOTE_STATE = 'QuoteState',
    CREATE_QUOTE_STATE = 'CreateQuoteState',
    GET_QUOTES_STATE = 'GetQuotesState',
    // -- Invoice States
    INVOICE_STATE = 'InvoiceState',
    // #endregion
  }
  