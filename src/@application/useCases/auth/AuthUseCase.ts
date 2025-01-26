import { IAuthUseCase } from '@domain/useCases/auth/IAuthUseCase';
import { ILoginUseCase } from '@domain/useCases/auth/ILoginUseCase';
import { ILogoutUseCase } from '@domain/useCases/auth/ILogoutUseCase';
import { IRegisterUseCase } from '@domain/useCases/auth/IRegisterUseCase';
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