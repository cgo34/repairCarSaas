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
    InvoiceRepository: Symbol.for(SYMBOL_NAMES.INVOICE_REPOSITORY),
    QuoteRepository: Symbol.for(SYMBOL_NAMES.QUOTE_REPOSITORY),
  },
  Services: {
    AuthService: Symbol.for(SYMBOL_NAMES.AUTH_SERVICE),
    NotificationService: Symbol.for(SYMBOL_NAMES.NOTIFICATION_SERVICE),
  },
  UseCases: {
    Auth: {
      Container: Symbol.for(SYMBOL_NAMES.AUTH_USE_CASE),
      LoginUseCase: Symbol.for(SYMBOL_NAMES.LOGIN_USE_CASE),
      LogoutUseCase: Symbol.for(SYMBOL_NAMES.LOGOUT_USE_CASE),
      RegisterUseCase: Symbol.for(SYMBOL_NAMES.REGISTER_USE_CASE),
    }
  },
  States: {
    AuthState: Symbol.for(SYMBOL_NAMES.AUTH_STATE),
  },
};

export { SYMBOLS };

