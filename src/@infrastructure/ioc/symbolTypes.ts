export enum SYMBOL_NAMES {
    // Clients
    SUPABASE_CLIENT = 'SupabaseClient',
    // Providers
    CLIENT_PROVIDER = 'ClientProvider',
    // Repositories
    AUTH_REPOSITORY = 'AuthRepository',
    USER_REPOSITORY = 'UserRepository',
    INVOICE_REPOSITORY = 'InvoiceRepository',
    QUOTE_REPOSITORY = 'QuoteRepository',
    // CarRepair Repositories
    BODY_PART_REPOSITORY = 'BodyPartRepository',
    // Services
    AUTH_SERVICE = 'AuthService',
    NOTIFICATION_SERVICE = 'NotificationService',
    // CarRepair Services
    BODY_PART_SERVICE = 'BodyPartService',
    // UseCases
    // -- Auth UseCases
    AUTH_USE_CASE = 'AuthUseCase',
    LOGIN_USE_CASE = 'LoginUseCase',
    LOGOUT_USE_CASE = 'LogoutUseCase',
    REGISTER_USE_CASE = 'RegisterUseCase',
    // -- CarRepair UseCases
    BODY_PART_USE_CASE = 'BodyPartUseCase',
    // States
    AUTH_STATE = 'AuthState',
    // -- CarRepair States
    BODY_PART_STATE = 'BodyPartState',
  }
  