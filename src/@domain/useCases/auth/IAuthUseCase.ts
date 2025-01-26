import { ILoginUseCase } from "@domain/useCases/auth/ILoginUseCase";
import { ILogoutUseCase } from "@domain/useCases/auth/ILogoutUseCase";
import { IRegisterUseCase } from "@domain/useCases/auth/IRegisterUseCase";

export interface IAuthUseCase {
    login: ILoginUseCase;
    logout: ILogoutUseCase;
    register: IRegisterUseCase;
  }