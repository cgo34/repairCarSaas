import { ILoginUseCase } from "@application/useCases/interfaces/auth/ILoginUseCase";
import { ILogoutUseCase } from "@application/useCases/interfaces/auth/ILogoutUseCase";
import { IRegisterUseCase } from "@application/useCases/interfaces/auth/IRegisterUseCase";

export interface IAuthUseCase {
    login: ILoginUseCase;
    logout: ILogoutUseCase;
    register: IRegisterUseCase;
  }