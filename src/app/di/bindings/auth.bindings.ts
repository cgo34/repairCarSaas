import type { Container } from 'inversify';
import { SYMBOLS } from '@/app/di/tokens';
import { RegisterUserWithOrganizationUseCase } from '@/features/auth/application/useCases/RegisterUserWithOrganizationUseCase';
import { IRegisterUserWithOrganizationUseCase } from '@/features/auth/application/useCases/RegisterUserWithOrganizationUseCase';
import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { ILoginUseCase } from '@/features/auth/application/useCases/LoginUseCase';
import { IAuthUseCase } from '@/features/auth/application/useCases/AuthUseCase';
import { ILogoutUseCase } from '@/features/auth/application/useCases/LogoutUseCase';
import { IRegisterUseCase } from '@/features/auth/application/useCases/RegisterUseCase';
import { AuthSupabaseRepository } from '@/features/auth/infrastructure/repositories/AuthSupabaseRepository';
import { AuthService } from '@/features/auth/application/services/AuthService';
import { AuthState } from '@/features/auth/presentation/state/AuthState';
import { AuthUseCase } from '@/features/auth/application/useCases/AuthUseCase';
import { LoginUseCase } from '@/features/auth/application/useCases/LoginUseCase';
import { LogoutUseCase } from '@/features/auth/application/useCases/LogoutUseCase';
import { RegisterUseCase } from '@/features/auth/application/useCases/RegisterUseCase';
import { GetAuthenticatedUserContextUseCase } from '@/features/auth/application/useCases/GetAuthenticatedUserContextUseCase';
import { IAuthRepository } from '@/features/auth/application/ports/repositories/IAuthRepository';
import { IAuthService } from '@/features/auth/application/ports/services/IAuthService';
import { IAuthenticatedUserContextUseCase } from '@/features/auth/application/useCases/GetAuthenticatedUserContextUseCase';

export function registerAuthBindings(container: Container): void {
  container.bind<IAuthRepository>(SYMBOLS.Repositories.AuthRepository).toDynamicValue(ctx => new AuthSupabaseRepository(ctx.container.get(SYMBOLS.Providers.ClientProvider))).inSingletonScope();
  container.bind<IAuthService>(SYMBOLS.Services.AuthService).toDynamicValue(ctx => new AuthService(ctx.container.get(SYMBOLS.Repositories.AuthRepository))).inSingletonScope();
  container.bind<IAuthUseCase>(SYMBOLS.UseCases.Auth.Container).toDynamicValue(ctx => new AuthUseCase(ctx.container.get(SYMBOLS.UseCases.Auth.LoginUseCase), ctx.container.get(SYMBOLS.UseCases.Auth.LogoutUseCase), ctx.container.get(SYMBOLS.UseCases.Auth.RegisterUseCase), ctx.container.get(SYMBOLS.UseCases.Subscription.SubscribeToFreePlanUseCase))).inSingletonScope();
  container.bind<ILoginUseCase>(SYMBOLS.UseCases.Auth.LoginUseCase).toDynamicValue(ctx => new LoginUseCase(ctx.container.get(SYMBOLS.Services.AuthService))).inSingletonScope();
  container.bind<ILogoutUseCase>(SYMBOLS.UseCases.Auth.LogoutUseCase).toDynamicValue(ctx => new LogoutUseCase(ctx.container.get(SYMBOLS.Services.AuthService))).inSingletonScope();
  container.bind<IRegisterUseCase>(SYMBOLS.UseCases.Auth.RegisterUseCase).toDynamicValue(ctx => new RegisterUseCase(ctx.container.get(SYMBOLS.Services.AuthService))).inSingletonScope();
  container.bind<IAuthenticatedUserContextUseCase>(SYMBOLS.UseCases.Auth.GetAuthenticatedUserContextUseCase).toDynamicValue(ctx => new GetAuthenticatedUserContextUseCase(ctx.container.get(SYMBOLS.Repositories.AuthRepository), ctx.container.get(SYMBOLS.Repositories.OrganizationRepository), ctx.container.get(SYMBOLS.Repositories.OrganizationMemberRepository), ctx.container.get(SYMBOLS.Repositories.SubscriptionRepository))).inSingletonScope();
  container.bind<IRegisterUserWithOrganizationUseCase>(SYMBOLS.UseCases.User.CreateUserWithOrganizationUseCase).toDynamicValue(ctx => new RegisterUserWithOrganizationUseCase(ctx.container.get(SYMBOLS.Services.SubscriptionService), ctx.container.get(SYMBOLS.Repositories.AuthRepository), ctx.container.get(SYMBOLS.Repositories.OrganizationRepository), ctx.container.get(SYMBOLS.Repositories.OrganizationMemberRepository), ctx.container.get(SYMBOLS.Repositories.UserRepository), ctx.container.get(SYMBOLS.Repositories.Setting.Price.SettingPriceRepository), ctx.container.get(SYMBOLS.Repositories.SubscriptionRepository))).inSingletonScope();
  container.bind<IAuthState>(SYMBOLS.States.AuthState).toDynamicValue(ctx => new AuthState(ctx.container.get(SYMBOLS.UseCases.Subscription.GetCurrentSubscriptionUseCase), ctx.container.get(SYMBOLS.UseCases.Auth.GetAuthenticatedUserContextUseCase), ctx.container.get(SYMBOLS.UseCases.Auth.Container), ctx.container.get(SYMBOLS.UseCases.Auth.LoginUseCase), ctx.container.get(SYMBOLS.UseCases.Auth.LogoutUseCase), ctx.container.get(SYMBOLS.UseCases.User.CreateUserUseCase), ctx.container.get(SYMBOLS.UseCases.User.CreateUserWithOrganizationUseCase), ctx.container.get(SYMBOLS.UseCases.Setting.Price.AllUseCase))).inSingletonScope();
}
