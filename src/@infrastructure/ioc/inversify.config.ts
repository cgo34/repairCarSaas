import { SYMBOLS } from '@infrastructure/ioc/symbols';
import { Container } from 'inversify';
import 'reflect-metadata';

import { AuthService } from '@application/services/auth/AuthService';
import { AuthState } from '@application/states/AuthState';
import { AuthUseCase } from '@application/useCases/auth/AuthUseCase';
import { LoginUseCase } from '@application/useCases/auth/LoginUseCase';
import { LogoutUseCase } from '@application/useCases/auth/LogoutUseCase';
import { RegisterUseCase } from '@application/useCases/auth/RegisterUseCase';
import { IAuthProvider } from '@domain/providers/IAuthProvider';
import { ISupabaseClient } from '@domain/providers/ISupabaseClient';
import { IAuthRepository } from '@domain/repositories/IAuthRepository';
import { IAuthService } from '@domain/services/IAuthService';
import { IAuthState } from '@domain/states/IAuthState';
import { IAuthUseCase } from '@domain/useCases/auth/IAuthUseCase';
import { ILoginUseCase } from '@domain/useCases/auth/ILoginUseCase';
import { ILogoutUseCase } from '@domain/useCases/auth/ILogoutUseCase';
import { IRegisterUseCase } from '@domain/useCases/auth/IRegisterUseCase';
import { SupabaseClient } from '@infrastructure/db/SupabaseClient';
import { AuthProvider } from '@infrastructure/providers/AuthProvider';
import { AuthRepository } from '@infrastructure/repositories/AuthRepository';

const container = new Container({ defaultScope: 'Singleton' });

// 1. Client
container.bind<ISupabaseClient>(SYMBOLS.Clients.SupabaseClient).to(SupabaseClient).inSingletonScope();

// 2. Provider
container.bind<IAuthProvider>(SYMBOLS.Providers.AuthProvider).to(AuthProvider).inSingletonScope();

// 3. Repository
container.bind<IAuthRepository>(SYMBOLS.Repositories.AuthRepository).to(AuthRepository).inSingletonScope();

// 4. Service
container.bind<IAuthService>(SYMBOLS.Services.AuthService).to(AuthService).inSingletonScope();

// 5. UseCase
container.bind<IAuthUseCase>(SYMBOLS.UseCases.Auth.Container).to(AuthUseCase).inSingletonScope();
container.bind<ILoginUseCase>(SYMBOLS.UseCases.Auth.LoginUseCase).to(LoginUseCase).inSingletonScope();
container.bind<ILogoutUseCase>(SYMBOLS.UseCases.Auth.LogoutUseCase).to(LogoutUseCase).inSingletonScope();
container.bind<IRegisterUseCase>(SYMBOLS.UseCases.Auth.RegisterUseCase).to(RegisterUseCase).inSingletonScope();

// 6. State
container.bind<IAuthState>(SYMBOLS.States.AuthState).to(AuthState).inSingletonScope();

// Vérification des bindings
console.log('Bindings check:', container.getAll(SYMBOLS.Services.AuthService));
console.log('Bindings check:', container.getAll(SYMBOLS.UseCases.Auth.Container)); // Actually not working

export { container };

