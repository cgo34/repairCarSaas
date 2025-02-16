import { SYMBOLS } from '@infrastructure/ioc/symbols';
import { Container } from 'inversify';
import 'reflect-metadata';

import { BodyPartService } from '@/@application/services/carRepair/BodyPartService';
import { useBodyPartState } from '@/@application/states/carRepair/useBodyPartState';
import { BodyPartUseCase } from '@/@application/useCases/carRepair/BodyPartUseCase';
import { IClientProvider } from '@/@domain/providers/IClientProvider';
import { IBodyPartRepository } from '@/@domain/repositories/carRepair/IBodyPartRepository';
import { IBodyPartService } from '@/@domain/services/carRepair/IBodyPartService';
import { IBodyPartState } from '@/@domain/states/carRepair/IBodyPartState';
import { IBodyPartUseCase } from '@/@domain/useCases/carRepair/IBodyPartUseCase';
import { AuthSupabaseRepository } from '@/@infrastructure/database/repositories/auth/AuthSupabaseRepository';
import { BodyPartRepository } from '@/@infrastructure/database/repositories/carRepair/BodyPartRepository';
import { AuthService } from '@application/services/auth/AuthService';
import { AuthState } from '@application/states/AuthState';
import { AuthUseCase } from '@application/useCases/auth/AuthUseCase';
import { LoginUseCase } from '@application/useCases/auth/LoginUseCase';
import { LogoutUseCase } from '@application/useCases/auth/LogoutUseCase';
import { RegisterUseCase } from '@application/useCases/auth/RegisterUseCase';
import { IAuthRepository } from '@domain/repositories/IAuthRepository';
import { IAuthService } from '@domain/services/IAuthService';
import { IAuthState } from '@domain/states/IAuthState';
import { IAuthUseCase } from '@domain/useCases/auth/IAuthUseCase';
import { ILoginUseCase } from '@domain/useCases/auth/ILoginUseCase';
import { ILogoutUseCase } from '@domain/useCases/auth/ILogoutUseCase';
import { IRegisterUseCase } from '@domain/useCases/auth/IRegisterUseCase';
import { SupabaseClientProvider } from '../database/providers/SupabaseClientProvider';

const container = new Container({ defaultScope: 'Singleton' });

// 1. Client
// container.bind<IClient>(SYMBOLS.Clients.SupabaseClient).to(SupabaseClient).inSingletonScope();

// 2. Provider
container.bind<IClientProvider>(SYMBOLS.Providers.ClientProvider).to(SupabaseClientProvider).inSingletonScope();

// 3. Repository
container.bind<IAuthRepository>(SYMBOLS.Repositories.AuthRepository).to(AuthSupabaseRepository).inSingletonScope();
// 3.1. CarRepair Repositories
container.bind<IBodyPartRepository>(SYMBOLS.Repositories.BodyPartRepository).to(BodyPartRepository).inSingletonScope();

// 4. Service
container.bind<IAuthService>(SYMBOLS.Services.AuthService).to(AuthService).inSingletonScope();
// 4.1. CarRepair Services
container.bind<IBodyPartService>(SYMBOLS.Services.BodyPartService).to(BodyPartService).inSingletonScope();

// 5. UseCase
container.bind<IAuthUseCase>(SYMBOLS.UseCases.Auth.Container).to(AuthUseCase).inSingletonScope();
container.bind<ILoginUseCase>(SYMBOLS.UseCases.Auth.LoginUseCase).to(LoginUseCase).inSingletonScope();
container.bind<ILogoutUseCase>(SYMBOLS.UseCases.Auth.LogoutUseCase).to(LogoutUseCase).inSingletonScope();
container.bind<IRegisterUseCase>(SYMBOLS.UseCases.Auth.RegisterUseCase).to(RegisterUseCase).inSingletonScope();
// 5.1. CarRepair UseCases
container.bind<IBodyPartUseCase>(SYMBOLS.UseCases.CarRepair.BodyPartUseCase).to(BodyPartUseCase).inSingletonScope();

// 6. State
container.bind<IAuthState>(SYMBOLS.States.AuthState).to(AuthState).inSingletonScope();
// 6.1. CarRepair States
// container.bind<IBodyPartState>(SYMBOLS.States.CarRepair.BodyPartState).to(useBodyPartState).inSingletonScope();
// Crée une factory injectable
container.bind<IBodyPartState>(SYMBOLS.States.CarRepair.BodyPartState).toDynamicValue((context) => {
  const bodyPartUseCase = context.container.get<IBodyPartUseCase>(SYMBOLS.UseCases.CarRepair.BodyPartUseCase);
  return useBodyPartState(bodyPartUseCase); // Retourne directement l'instance
});

// Vérification des bindings
// console.log('Bindings check:', container.getAll(SYMBOLS.Services.AuthService));
// console.log('Bindings check:', container.getAll(SYMBOLS.UseCases.Auth.Container)); // Actually not working
// console.log('Bindings check:', container.getAll(SYMBOLS.Services.BodyPartService));
// console.log('Bindings check:', container.getAll(SYMBOLS.UseCases.CarRepair.BodyPartUseCase));

export { container };

