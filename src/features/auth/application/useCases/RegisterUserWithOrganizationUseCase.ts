import { UserDto } from '@/features/users/application/dtos/UserDto';
import { IAuthRepository } from '@/features/auth/application/ports/repositories/IAuthRepository';
import { IProvisionOrganizationUseCase } from '@/features/auth/application/useCases/ProvisionOrganizationUseCase';

export interface IRegisterUserWithOrganizationUseCase {
  execute(email: string, password: string, fullName: string): Promise<UserDto>;
}

/**
 * Sign-up orchestration.
 * - The public.users profile is created by the on_auth_user_created trigger.
 * - Organization, admin membership and Free plan are provisioned server-side
 *   (RPC provision_organization), which requires an authenticated session.
 * - Provisioning is idempotent and is retried at the next login if it could not
 *   run here (email confirmation enabled, transient failure). The auth account is
 *   therefore never deleted as a compensation: the account is valid on its own.
 */
export class RegisterUserWithOrganizationUseCase implements IRegisterUserWithOrganizationUseCase {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly provisionOrganizationUseCase: IProvisionOrganizationUseCase
  ) {}

  async execute(email: string, password: string, fullName: string): Promise<UserDto> {
    const { user } = await this.authRepository.register(email, password, fullName);

    if (!user) throw new Error('User creation failed');

    try {
      await this.authRepository.login(email, password);
    } catch (error) {
      // Email confirmation pending: provisioning is deferred to the first login.
      console.warn('[RegisterUserWithOrganization] No session after sign-up, provisioning deferred:', error);
      return user;
    }

    try {
      await this.provisionOrganizationUseCase.execute(fullName);
    } catch (error) {
      console.error('[RegisterUserWithOrganization] Provisioning failed, will be retried at login:', error);
    }

    return user;
  }
}
