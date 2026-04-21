import { AuthError } from '@/@domain/errors/AuthError';
import { IAuthUseCase } from '@/@domain/useCases/auth/IAuthUseCase';
import { ISettingPriceUseCase } from '@/@domain/useCases/settings/price/ISettingPriceUseCase';
import { IGetCurrentSubscriptionUseCase } from '@/@domain/useCases/subscription/IGetCurrentSubscriptionUseCase';
import { ICreateUserUseCase } from '@/@domain/useCases/user/ICreateUserUseCase';
import { AuthErrorCode } from '@/@domain/valueObjects/AuthErrorCode';
import { UserDto } from '@/@application/dtos/UserDto';
import { UserViewModel } from '@/@presentation/types/models/UserViewModel';
import { UserMapper as PresentationUserMapper } from '@/@presentation/mappers/UserMapper';
import { IAuthState } from '@domain/states/IAuthState';
import { IAuthStateSnapshot } from '@domain/states/IAuthStateSnapshot';
import { ILoginUseCase } from '@domain/useCases/auth/ILoginUseCase';
import { ILogoutUseCase } from '@domain/useCases/auth/ILogoutUseCase';
import { SYMBOLS } from '@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';
import { ref } from 'vue';
import { SubscriptionDto } from '@/@application/dtos/SubscriptionDto';

@injectable()
export class AuthState implements IAuthState {
  public user = ref<UserViewModel>({
    id: '',
    email: '',
    password: '',
    fullName: '',
    createdAt: '',
    role: ''
  });
  public subscription = ref<SubscriptionDto | null>(null)
  public isAuthenticated = ref<boolean>(false);

  private subscribers = new Set<(state: IAuthStateSnapshot) => void>();
  private stateHistory: IAuthStateSnapshot[] = [];
  private readonly STORAGE_KEY = 'auth_state';
  private _isAuthReady = false;

  constructor(
    @inject(SYMBOLS.UseCases.Subscription.GetCurrentSubscriptionUseCase) private getCurrentSubscription: IGetCurrentSubscriptionUseCase,
    @inject(SYMBOLS.UseCases.Auth.Container) private authUseCase: IAuthUseCase,
    @inject(SYMBOLS.UseCases.Auth.LoginUseCase) private loginUseCase: ILoginUseCase,
    @inject(SYMBOLS.UseCases.Auth.LogoutUseCase) private logoutUseCase: ILogoutUseCase,
    @inject(SYMBOLS.UseCases.User.CreateUserUseCase) private createUserUseCase: ICreateUserUseCase,
    @inject(SYMBOLS.UseCases.Setting.Price.AllUseCase) private settingPriceUseCase: ISettingPriceUseCase,
  ) {
    this.loadPersistedState();
  }

  // Pattern Observer
  public subscribe(callback: (state: IAuthStateSnapshot) => void): () => void {
    this.subscribers.add(callback);
    callback(this.createSnapshot());
    return () => this.subscribers.delete(callback);
  }

  // État immutable avec historique
  public getLastState(): IAuthStateSnapshot {
    return this.stateHistory[this.stateHistory.length - 1];
  }

  public getHistory(): IAuthStateSnapshot[] {
    return [...this.stateHistory];
  }

  private createSnapshot(): IAuthStateSnapshot {
    return {
      user: this.user.value,
      isAuthenticated: this.isAuthenticated.value,
      subscription: this.subscription.value,
      timestamp: new Date()
    };
  }

  private pushState() {
    const snapshot = this.createSnapshot();
    this.stateHistory.push(snapshot);
    this.persistState(snapshot);
    this.notifySubscribers(snapshot);
  }

  private notifySubscribers(snapshot: IAuthStateSnapshot) {
    this.subscribers.forEach(callback => callback(snapshot));
  }

  // Persistence de l'état
  private persistState(snapshot: IAuthStateSnapshot) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(snapshot));
    } catch (error) {
      console.error('Failed to persist auth state:', error);
    }
  }

  private loadPersistedState() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const snapshot: IAuthStateSnapshot = JSON.parse(stored);
        this.user.value = snapshot.user;
        this.isAuthenticated.value = snapshot.isAuthenticated;
        this.subscription.value = snapshot.subscription;
        this.stateHistory.push(snapshot);
      }
    } catch (error) {
      console.error('Failed to load persisted auth state:', error);
    }
  }

  async login(email: string, password: string): Promise<void> {
    try {
      const userDto: UserDto = await this.authUseCase.login.execute(email, password);
      if (!userDto) {
        throw new AuthError(
          AuthErrorCode.AUTH_NO_USER_RETURNED,
          'No user returned after login'
        );
      }
      // Récupérer la subscription (non-bloquant si erreur)
      let subscription = null;
      try {
        subscription = await this.getCurrentSubscription.execute(userDto.id);
      } catch (subError) {
        console.warn('[AuthState] Could not fetch subscription, continuing login:', subError);
      }
      this.subscription.value = subscription;
      this.user.value = PresentationUserMapper.dtoToView(userDto);
      this.isAuthenticated.value = true;
      this.pushState();
      
    } catch (error) {
      console.error('AuthState login error:', error);
      
      // Réinitialisation de l'état en cas d'erreur
      this.user.value = {
        id: '',
        email: '',
        password: '',
        fullName: '',
        createdAt: ''
      };
      this.isAuthenticated.value = false;
      this.subscription.value = null;
      throw new AuthError(
        AuthErrorCode.LOGIN_FAILED,
        'Login failed',
        error
      );
    }
  }

  async register(email: string, password: string, fullName: string): Promise<void> {
    try {
      const { user, error } = await this.authUseCase.register.execute(email, password, fullName);
      if (!user) {
        throw new AuthError(
          AuthErrorCode.REGISTRATION_FAILED,
          'Registration failed: no user returned'
        );
      }
      // Mise à jour de l'état
      this.isAuthenticated.value = true;
      // Mapper UserDto -> UserViewModel
      this.user.value = PresentationUserMapper.dtoToView(user);

      // Utilisation des méthodes communes
      this.pushState();
      
      // Une fois inscrit, créer son profil dans public.users
      const userDto = PresentationUserMapper.viewToDto(this.user.value);
      await this.createUserUseCase.execute(userDto);

      // Copier les settings de prix par défaut (admin) pour le nouvel utilisateur
      try {
        await this.settingPriceUseCase.createSettingsForUser(this.user.value.id);
      } catch (settingsError) {
        console.error('[AuthState] Could not copy default price settings:', settingsError);
      }      
    } catch (error) {
      throw new AuthError(
        AuthErrorCode.REGISTRATION_FAILED,
        'Registration failed',
        error
      );
    }

    
      // ➕ Lier automatiquement le plan 'free'
      const subscription = await this.authUseCase.subscribeToFreePlan.execute(this.user.value.id);
      
      this.subscription.value = subscription;
      this.user.value.subscription = subscription;
  }

 async logout(): Promise<void> {
    try {
      await this.authUseCase.logout.execute();
      
      this.user.value = {
        email: '',
        password: '',
        fullName: ''
      };
      this.isAuthenticated.value = false;
      this.pushState();
      
      localStorage.removeItem(this.STORAGE_KEY);
      
    } catch (error) {
      throw new AuthError(
        AuthErrorCode.LOGOUT_FAILED,
        'Logout failed',
        error
      );
    }
  }

  get isAuthReady() {
    return this._isAuthReady;
  }

  get isFreePlan() {
    return this.subscription.value?.subscriptionPlan.name === 'free'
  }

  setAuthReady(value: boolean) {
    this._isAuthReady = value;
  }
}
