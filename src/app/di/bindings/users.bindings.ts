import type { Container } from 'inversify';
import { SYMBOLS } from '@/app/di/tokens';
import { CreateUserUseCase } from '@/features/users/application/useCases/CreateUserUseCase';
import { UserRepository } from '@/features/users/infrastructure/repositories/UserRepository';
import { UserService } from '@/features/users/application/services/UserService';
import { UserUseCase } from '@/features/users/application/useCases/UserUseCase';
import { IUserRepository } from '@/features/users/application/ports/repositories/IUserRepository';
import { IUserService } from '@/features/users/application/ports/services/IUserService';
import { IUserUseCase } from '@/features/users/application/useCases/UserUseCase';
import { ICreateUserUseCase } from '@/features/users/application/useCases/CreateUserUseCase';
import { useUserState } from '@/features/users/composition/useUserState';
import { IUseUserState } from '@/features/users/presentation/types/IUseUserState';

export function registerUsersBindings(container: Container): void {
  container.bind<IUserRepository>(SYMBOLS.Repositories.UserRepository).toDynamicValue(ctx => new UserRepository(ctx.container.get(SYMBOLS.Providers.ClientProvider))).inSingletonScope();
  container.bind<IUserService>(SYMBOLS.Services.UserService).toDynamicValue(ctx => new UserService(ctx.container.get(SYMBOLS.Repositories.UserRepository))).inSingletonScope();
  container.bind<IUserUseCase>(SYMBOLS.UseCases.UserUseCase).toDynamicValue(ctx => new UserUseCase(ctx.container.get(SYMBOLS.Services.UserService))).inSingletonScope();
  container.bind<ICreateUserUseCase>(SYMBOLS.UseCases.User.CreateUserUseCase).toDynamicValue(ctx => new CreateUserUseCase(ctx.container.get(SYMBOLS.Repositories.UserRepository))).inSingletonScope();
  container.bind<IUseUserState>(SYMBOLS.States.UserState).toDynamicValue(() => {
    return useUserState();
  });
}
