// TODO: (GCE) -> TO BE MOVED TO CORE

export enum SYMBOL_NAMES {
    // Managers
    REGION_MANAGER= 'RegionManager',

    // Clients
    SUPABASE_CLIENT = 'SupabaseClient',

    // Providers
    CLIENT_PROVIDER = 'ClientProvider',

    // #region -> REPOSITORIES
    AUTH_REPOSITORY = 'AuthRepository',
    USER_REPOSITORY = 'UserRepository',
    ORGANIZATION_REPOSITORY = 'OrganizationRepository',
    ORGANIZATION_PROFILE_REPOSITORY = 'OrganizationProfileRepository',
    ORGANIZATION_MEMBER_REPOSITORY = 'OrganizationMemberRepository',
    // -- Subscription REPOSITORIES
    SUBSCRIPTION_REPOSITORY = 'SubscriptionRepository',
    FEATURE_ACCESS_REPOSITORY = 'FeatureAccessRepository',

    GARAGE_REPOSITORY = 'GarageRepository',
    VEHICLE_REPOSITORY = 'VehicleRepository',

    // -- Document Statuses REPOSITORIES
    DOCUMENT_STATUS_REPOSITORY = 'DocumentStatusRepository',

    INVOICE_REPOSITORY = 'InvoiceRepository',
    INVOICE_DETAIL_REPOSITORY = 'InvoiceDetailRepository',
    QUOTE_REPOSITORY = 'QuoteRepository',
    QUOTE_DETAIL_REPOSITORY = 'QuoteDetailRepository',
    // Settings CarRepair Repositories
    BODY_PART_REPOSITORY = 'BodyPartRepository',
    BODY_MATERIAL_REPOSITORY = 'BodyMaterialRepository',
    DENT_REPAIR_TYPE_REPOSITORY = 'DentRepairTypeRepository',
    // -- Settings Prices CarRepair Repositories
    SETTING_PRICE_REPOSITORY = 'SettingPriceRepository',
    SETTING_PRICE_GENERAL_REPOSITORY = 'SettingPriceGeneralRepository',
    SETTING_PRICE_IMPACT_COUNT_TO_UT_REPOSITORY = 'SettingPriceImpactCountToUtRepository',
    SETTING_PRICE_DIAMETER_COEFFICIENT_REPOSITORY = 'SettingPriceDiameterCoefficientRepository',
    SETTING_PRICE_BODY_PART_COEFFICIENT = 'SettingPriceBodyPartCoefficient',
    SETTING_PRICE_TECHNICITY_COEFFICIENT_REPOSITORY = 'SettingPriceTechnicityCoefficientRepository',
    // #endregion

    // #region -> SERVICES
    AUTH_SERVICE = 'AuthService',
    USER_SERVICE = 'UserService',
    SUBSCRIPTION_SERVICE = 'SubscriptionService',
    GARAGE_SERVICE = 'GarageService',
    VEHICLE_SERVICE = 'VehicleService',
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
    SETTING_PRICE_BODY_PART_COEFFICIENT_SERVICE = 'SettingPriceBodyPartCoefficientService',
    SETTING_PRICE_TECHNICITY_COEFFICIENT_SERVICE = 'SettingPriceTechnicityCoefficientService',
    // -- Pdf Generator Services
    PDF_GENERATOR_SERVICE = 'PdfGeneratorService',
    DOWNLOAD_SERVICE = 'DownloadService',
    EMAIL_SERVICE = 'EmailService',
    // #endregion
  
    // #region -> USE CASES
    // -- Auth UseCases
    AUTH_USE_CASE = 'AuthUseCase',
    LOGIN_USE_CASE = 'LoginUseCase',
    LOGOUT_USE_CASE = 'LogoutUseCase',
    REGISTER_USE_CASE = 'RegisterUseCase',
    GET_AUTHENTICATED_USER_CONTEXT_USE_CASE = 'GetAuthenticatedUserContextUseCase',
    PROVISION_ORGANIZATION_USE_CASE = 'ProvisionOrganizationUseCase',
    // -- Profile switcher (super_admin demo profiles)
    DEMO_PROFILE_REPOSITORY = 'DemoProfileRepository',
    LIST_DEMO_PROFILES_USE_CASE = 'ListDemoProfilesUseCase',
    SWITCH_DEMO_PROFILE_USE_CASE = 'SwitchDemoProfileUseCase',
    CLEAR_DEMO_PROFILE_USE_CASE = 'ClearDemoProfileUseCase',
    CREATE_DEMO_PROFILE_USE_CASE = 'CreateDemoProfileUseCase',
    DELETE_DEMO_PROFILE_USE_CASE = 'DeleteDemoProfileUseCase',
    // -- Platform admin (super_admin)
    PLATFORM_STATS_REPOSITORY = 'PlatformStatsRepository',
    GET_PLATFORM_STATS_USE_CASE = 'GetPlatformStatsUseCase',
    PLATFORM_ORGANIZATION_REPOSITORY = 'PlatformOrganizationRepository',
    PLATFORM_USER_REPOSITORY = 'PlatformUserRepository',
    LIST_PLATFORM_ORGANIZATIONS_USE_CASE = 'ListPlatformOrganizationsUseCase',
    GRANT_PREMIUM_USE_CASE = 'GrantPremiumUseCase',
    GRANT_FEATURE_USE_CASE = 'GrantFeatureUseCase',
    SET_ORGANIZATION_DEMO_USE_CASE = 'SetOrganizationDemoUseCase',
    LIST_PLATFORM_USERS_USE_CASE = 'ListPlatformUsersUseCase',
    PLATFORM_PLAN_REPOSITORY = 'PlatformPlanRepository',
    LIST_PLATFORM_PLANS_USE_CASE = 'ListPlatformPlansUseCase',
    PREVIEW_PLAN_CHANGES_USE_CASE = 'PreviewPlanChangesUseCase',
    APPLY_PLAN_CHANGES_USE_CASE = 'ApplyPlanChangesUseCase',
    LIST_PLAN_CHANGE_LOG_USE_CASE = 'ListPlanChangeLogUseCase',
    // -- User UseCases
    USER_USE_CASE = 'UserUseCase',
    CREATE_USER_WITH_ORGANIZATION_USE_CASE = 'CreateUserWithOrganizationUseCase',
    // -- Organization Member UseCases
    ORGANIZATION_PROFILE_USE_CASE = 'OrganizationProfileUseCase',
    ORGANIZATION_MEMBER_USE_CASE = 'OrganizationMemberUseCase',
    CREATE_ORGANIZATION_TECHNICIAN_USE_CASE = 'CreateOrganizationTechnicianUseCase',
    // -- Garage UseCases
    GARAGE_USE_CASE = 'GarageUseCase',
    VEHICLE_USE_CASE = 'VehicleUseCase',
    // -- Settings CarRepair UseCases
    BODY_PART_USE_CASE = 'BodyPartUseCase',
    BODY_MATERIAL_USE_CASE = 'BodyMaterialUseCase',
    DENT_REPAIR_TYPE_USE_CASE = 'DentRepairTypeUseCase',
    // -- Settings Prices CarRepair UseCases
    SETTING_PRICE_USE_CASE = 'SettingPriceUseCase',
    SETTING_PRICE_GENERAL_USE_CASE = 'SettingPriceGeneralUseCase',
    SETTING_PRICE_DIAMETER_COEFFICIENT_USE_CASE = 'SettingPriceDiameterCoefficientUseCase',
    SETTING_PRICE_IMPACT_COUNT_TO_UT_USE_CASE = 'SettingPriceImpactCountToUtUseCase',
    SETTING_PRICE_BODY_PART_COEFFICIENT_USE_CASE = 'SettingPriceBodyPartCoefficientUseCase',
    SETTING_PRICE_TECHNICITY_COEFFICIENT_USE_CASE = 'SettingPriceTechnicityCoefficientUseCase',
    // -- Cost Calculator UseCases
    CALCULATE_TOTAL_COST_USE_CASE = 'CalculateTotalCostUseCase',
    CALCULATE_LINE_COST_USE_CASE = 'CalculateLineCostUseCase',
    // -- Document Status UseCases
    GET_DOCUMENT_STATUS_USE_CASE = 'GetDocumentStatusUseCase',
    // -- Quote UseCases
    QUOTE_USE_CASE = 'QuoteUseCase',
    GET_QUOTE_USE_CASE = 'GetQuoteUseCase',
    GET_QUOTES_USE_CASE = 'GetQuotesUseCase',
    COUNT_QUOTES_THIS_MONTH_USE_CASE = 'CountQuotesThisMonthUseCase',
    VIEW_QUOTE_USE_CASE = 'ViewQuoteUseCase',
    CREATE_QUOTE_USE_CASE = 'CreateQuoteUseCase',
    INSERT_QUOTE_USE_CASE = 'InsertQuoteUseCase',
    UPDATE_QUOTE_USE_CASE = 'UpdateQuoteUseCase',
    UPDATE_STATUS_QUOTE_USE_CASE = 'UpdateStatusQuoteUseCase',
    DELETE_QUOTE_USE_CASE = 'DeleteQuoteUseCase',
    // -- Quote Details UseCases
    GET_QUOTE_DETAILS_USE_CASE = 'GetQuoteDetailsUseCase',
    ADD_QUOTE_DETAILS_USE_CASE = 'AddQuoteDetailsUseCase',
    ADD_QUOTE_LINE_ITEM_USE_CASE = 'AddQuoteLineItemUseCase',
    UPDATE_QUOTE_LINE_ITEM_USE_CASE = 'UpdateQuoteLineItemUseCase',
    DELETE_LINE_ITEM_USE_CASE = 'DeleteLineItemUseCase',

    DUPLICATE_QUOTE_TO_INVOICE = 'DuplicateQuoteToInvoice',

    // -- Pdf UseCases
    GENERATE_QUOTE_PDF_USE_CASE = 'GenerateQuotePdfUseCase',
    SEND_QUOTE_USE_CASE = 'SendQuoteUseCase',
    FINALIZE_QUOTE_USE_CASE = 'FinalizeQuoteUseCase',

    // -- Invoice UseCases
    INVOICE_USE_CASE = 'InvoiceUseCase',
    GET_INVOICE_USE_CASE = 'GetInvoiceUseCase',
    GET_INVOICES_USE_CASE = 'GetInvoicesUseCase',
    COUNT_INVOICES_THIS_MONTH_USE_CASE = 'CountInvoicesThisMonthUseCase',
    COUNT_CONVERSIONS_THIS_MONTH_USE_CASE = 'CountConversionsThisMonthUseCase',
    VIEW_INVOICE_USE_CASE = 'ViewInvoiceUseCase',
    CREATE_INVOICE_USE_CASE = 'CreateInvoiceUseCase',
    INSERT_INVOICE_USE_CASE = 'InsertInvoiceUseCase',
    UPDATE_INVOICE_USE_CASE = 'UpdateInvoiceUseCase',
    SAVE_INVOICE_USE_CASE = 'SaveInvoiceUseCase',
    MARK_INVOICE_AS_PAID_USE_CASE = 'MarkInvoiceAsPaidUseCase',
    DELETE_INVOICE_USE_CASE = 'DeleteInvoiceUseCase',
    // -- Invoice Details UseCases
    GET_INVOICE_DETAILS_USE_CASE = 'GetInvoiceDetailsUseCase',
    ADD_INVOICE_DETAILS_USE_CASE = 'AddInvoiceDetailsUseCase',
    ADD_INVOICE_LINE_ITEM_USE_CASE = 'AddInvoiceLineItemUseCase',
    UPDATE_INVOICE_LINE_ITEM_USE_CASE = 'UpdateInvoiceLineItemUseCase',
    // DELETE_LINE_ITEM_USE_CASE = 'DeleteLineItemUseCase',
    // -- Pdf UseCases
    GENERATE_INVOICE_PDF_USE_CASE = 'GenerateInvoicePdfUseCase',
    SEND_INVOICE_USE_CASE = 'SendInvoiceUseCase',
    FINALIZE_INVOICE_USE_CASE = 'FinalizeInvoiceUseCase',
    
    // -- Subscription UseCases
    SUBSCRIBE_TO_FREE_PLAN_USE_CASE = 'SubscribeToFreePlan',
    GET_CURRENT_SUBSCRIPTION_USE_CASE = 'GetCurrentSubscriptionUseCase',
    // -- Feature access UseCases
    GET_FEATURE_ACCESS_USE_CASE = 'GetFeatureAccessUseCase',
    // #endregion

    // #region -> STATES
    AUTH_STATE = 'AuthState',
    SUBSCRIPTION_STATE = 'SubscriptionState',
    FEATURE_ACCESS_STATE = 'FeatureAccessState',
    // -- User States
    USER_STATE = 'UserState',
    ORGANIZATION_PROFILE_STATE = 'OrganizationProfileState',
    ORGANIZATION_MEMBER_STATE = 'OrganizationMemberState',
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
    SETTING_PRICE_DIAMETER_COEFFICIENT_STATE = 'SettingPriceDiameterCoefficientState',
    SETTING_PRICE_IMPACT_COUNT_TO_UT_STATE = 'SettingPriceImpactCountToUtState',
    SETTING_PRICE_BODY_PART_COEFFICIENT_STATE = 'SettingPriceBodyPartCoefficientState',
    SETTING_PRICE_TECHNICITY_COEFFICIENT_STATE = 'SettingPriceTechnicityCoefficientState',
    // -- Quote States
    QUOTE_STATE = 'QuoteState',
    VIEW_QUOTE_STATE = 'ViewQuoteState',
    CREATE_QUOTE_STATE = 'CreateQuoteState',
    EDIT_QUOTE_STATE = 'EditQuoteState',
    GET_QUOTES_STATE = 'GetQuotesState',
    // -- Invoice States
    INVOICE_STATE = 'InvoiceState',
    VIEW_INVOICE_STATE = 'ViewInvoiceState',
    CREATE_INVOICE_STATE = 'CreateInvoiceState',
    EDIT_INVOICE_STATE = 'EditInvoiceState',
    GET_INVOICES_STATE = 'GetInvoicesState',
    // -- Company Settings
    COMPANY_SETTINGS_REPOSITORY = 'CompanySettingsRepository',
    COMPANY_SETTINGS_USE_CASE = 'CompanySettingsUseCase',
    COMPANY_SETTINGS_STATE = 'CompanySettingsState',
    // -- Profile State
    PROFILE_STATE = 'ProfileState',
    // -- Technician
    TECHNICIAN_GARAGE_ACCESS_REPOSITORY = 'TechnicianGarageAccessRepository',
    TECHNICIAN_STATS_USE_CASE = 'TechnicianStatsUseCase',
    TECHNICIANS_STATE = 'TechniciansState',
    TECHNICIAN_DETAIL_STATE = 'TechnicianDetailState',
    // -- Hail Monitoring
    HAIL_ALERT_REPOSITORY = 'HailAlertRepository',
    MONITORED_LOCATION_REPOSITORY = 'MonitoredLocationRepository',
    HAIL_MONITORING_STATE = 'HailMonitoringState',
    // #endregion
  }
  