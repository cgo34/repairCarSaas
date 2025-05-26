
import { IAuthUseCase } from '@/@domain/useCases/auth/IAuthUseCase';
import { ILogoutUseCase } from '@/@domain/useCases/auth/ILogoutUseCase';
import { IRegisterUseCase } from '@/@domain/useCases/auth/IRegisterUseCase';
import { ISubscribeToFreePlanUseCase } from '@/@domain/useCases/subscription/ISubscribeToFreePlanUseCase';
import { ILoginUseCase } from '@application/useCases/interfaces/auth/ILoginUseCase';
import { SYMBOLS } from '@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class AuthUseCase implements IAuthUseCase {
  constructor(
    @inject(SYMBOLS.UseCases.Auth.LoginUseCase) public login: ILoginUseCase,
    @inject(SYMBOLS.UseCases.Auth.LogoutUseCase) public logout: ILogoutUseCase,
    @inject(SYMBOLS.UseCases.Auth.RegisterUseCase) public register: IRegisterUseCase,
    @inject(SYMBOLS.UseCases.Subscription.SubscribeToFreePlanUseCase) public subscribeToFreePlan: ISubscribeToFreePlanUseCase
  ) {}
}