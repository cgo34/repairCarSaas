
import { ILogoutUseCase } from '@/features/auth/application/useCases/LogoutUseCase';
import { IRegisterUseCase } from '@/features/auth/application/useCases/RegisterUseCase';
import { ISubscribeToFreePlanUseCase } from '@/features/subscription/application/useCases/SubscribeToFreePlanUseCase';
import { ILoginUseCase } from '@/features/auth/application/useCases/LoginUseCase';

export interface IAuthUseCase {
    login: ILoginUseCase;
    logout: ILogoutUseCase;
    register: IRegisterUseCase;
    subscribeToFreePlan: ISubscribeToFreePlanUseCase;
  }

export class AuthUseCase implements IAuthUseCase {
  constructor(
    public login: ILoginUseCase,
    public logout: ILogoutUseCase,
    public register: IRegisterUseCase,
    public subscribeToFreePlan: ISubscribeToFreePlanUseCase
  ) {}
}
