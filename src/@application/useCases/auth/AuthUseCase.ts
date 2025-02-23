
import { IAuthUseCase } from '@application/useCases/interfaces/auth/IAuthUseCase';
import { ILoginUseCase } from '@application/useCases/interfaces/auth/ILoginUseCase';
import { ILogoutUseCase } from '@application/useCases/interfaces/auth/ILogoutUseCase';
import { IRegisterUseCase } from '@application/useCases/interfaces/auth/IRegisterUseCase';
import { SYMBOLS } from '@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class AuthUseCase implements IAuthUseCase {
  constructor(
    @inject(SYMBOLS.UseCases.Auth.LoginUseCase) public login: ILoginUseCase,
    @inject(SYMBOLS.UseCases.Auth.LogoutUseCase) public logout: ILogoutUseCase,
    @inject(SYMBOLS.UseCases.Auth.RegisterUseCase) public register: IRegisterUseCase
  ) {}
}