import { ILogoutUseCase } from "@/@domain/useCases/auth/ILogoutUseCase";
import { IRegisterUseCase } from "@/@domain/useCases/auth/IRegisterUseCase";
import { ILoginUseCase } from "@application/useCases/interfaces/auth/ILoginUseCase";

export interface IAuthUseCase {
    login: ILoginUseCase;
    logout: ILogoutUseCase;
    register: IRegisterUseCase;
  }