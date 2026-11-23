import { UserDto } from '@/features/users/application/dtos/UserDto';
import { IUserRepository } from '@/features/users/application/ports/repositories/IUserRepository';
import { IAuthRepository } from '@/features/auth/application/ports/repositories/IAuthRepository';
import { IOrganizationRepository } from '@/features/organizations/application/ports/repositories/IOrganizationRepository';
import { IOrganizationMemberRepository } from '@/features/organizations/application/ports/repositories/IOrganizationMemberRepository';
import { ISubscriptionRepository } from '@/features/subscription/application/ports/repositories/ISubscriptionRepository';
import { ISettingPriceRepository } from '@/features/priceSettings/application/ports/repositories/ISettingPriceRepository';
import { ISubscriptionService } from '@/features/subscription/application/services/ISubscriptionService';

export interface IRegisterUserWithOrganizationUseCase {
  execute(email: string, password: string, fullName: string): Promise<UserDto>;
}

export class RegisterUserWithOrganizationUseCase implements IRegisterUserWithOrganizationUseCase {
  constructor(
    private subscriptionService: ISubscriptionService,
    private authRepository: IAuthRepository,
    private organizationRepository: IOrganizationRepository,
    private organizationMemberRepository: IOrganizationMemberRepository,
    private userRepository: IUserRepository,
    private settingPriceRepository: ISettingPriceRepository,
    private subscriptionRepository: ISubscriptionRepository
  ) {
  }

  async execute(email: string, password: string, fullName: string): Promise<UserDto> {
  
    let user: UserDto | null = null;

    try {
      const { user: registeredUser } = await this.authRepository.register(email, password, fullName);
      user = registeredUser;
      
      if (!user) throw new Error('User creation failed');

      // 🔥 AJOUT CRITIQUE
      await this.authRepository.login(email, password);

      // 🔥 attendre session (optionnel mais safe)
      // await this.authRepository.getUserSession();

      const session = await this.authRepository.getUserSession();
      const sessionUserId = session.data.session?.user.id;

      if (!sessionUserId) throw new Error('Authenticated user not found');

      const organization = await this.organizationRepository.create({
        name: `${fullName}'s workspace`,
        owner_user_id: sessionUserId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      

      if (!organization.id) throw new Error('Organization id is undefined');

      await this.userRepository.createUser(user);

      await this.organizationMemberRepository.create({
        user_id: sessionUserId,
        organization_id: organization.id,
        role: 'admin',
        created_at: new Date().toISOString()
      });

      // recupère les paramètres de prix par default :
      await this.settingPriceRepository.createForUser(organization.id);


      await this.subscriptionService.activateFreePlanForOrganization(
        organization.id
      );

      return user;

    } catch (error) {
      console.error('[RegisterUserWithOrganization] ERREUR:', error);

      if (user) {
        await this.authRepository.deleteUser(user.id);
      }

      // throw new AuthError(
      //   AuthErrorCode.REGISTRATION_FAILED,
      //   'Failed to register user with organization',
      //   error
      // );
      throw error;
    }
  }
}
