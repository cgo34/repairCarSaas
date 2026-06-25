import { IAuthService } from '@/@domain/services/IAuthService';
import { IRegisterUseCase } from '@/@domain/useCases/auth/IRegisterUseCase';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { UserDto } from '@/@application/dtos/UserDto';
import { inject, injectable } from 'inversify';
import { AuthError } from '@/@domain/errors/AuthError';
import { IUserRepository } from '@/@domain/repositories/IUserRepository';
import { IAuthRepository } from '@/@domain/repositories/IAuthRepository';
import { IOrganizationRepository } from '@/@domain/repositories/IOrganizationRepository';
import { IOrganizationMemberRepository } from '@/@domain/repositories/IOrganizationMemberRepository';
import { ISubscriptionRepository } from '@/@domain/repositories/ISubscriptionRepository';
import { IRegisterUserWithOrganizationUseCase } from '@/@domain/useCases/auth/IRegisterUserWithOrganizationUseCase';
import { ISettingPriceRepository } from '@/@domain/repositories/settings/price/ISettingPriceRepository';
import { ISubscriptionService } from '@/@application/services/subscription/ISubscriptionService';

@injectable()
export class RegisterUserWithOrganizationUseCase implements IRegisterUserWithOrganizationUseCase {
  constructor(
    @inject(SYMBOLS.Services.SubscriptionService) private subscriptionService: ISubscriptionService,
    @inject(SYMBOLS.Repositories.AuthRepository) private authRepository: IAuthRepository,
    @inject(SYMBOLS.Repositories.OrganizationRepository) private organizationRepository: IOrganizationRepository,
    @inject(SYMBOLS.Repositories.OrganizationMemberRepository) private organizationMemberRepository: IOrganizationMemberRepository,
    @inject(SYMBOLS.Repositories.UserRepository) private userRepository: IUserRepository,
    @inject(SYMBOLS.Repositories.Setting.Price.SettingPriceRepository) private settingPriceRepository: ISettingPriceRepository,
    @inject(SYMBOLS.Repositories.SubscriptionRepository) private subscriptionRepository: ISubscriptionRepository
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

      const organization = await this.organizationRepository.create({
        name: `${fullName}'s workspace`,
        owner_user_id: session.data.session.user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      

      if (!organization.id) throw new Error('Organization id is undefined');

      await this.userRepository.createUser(user);

      await this.organizationMemberRepository.create({
        user_id: session.data.session.user.id,
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
    }
  }
}
