import { AuthError } from '@/features/auth/domain/errors/AuthError';
import { IAuthUseCase } from '@/features/auth/application/useCases/AuthUseCase';
import { ISettingPriceUseCase } from '@/features/priceSettings/application/useCases/SettingPriceUseCase';
import { IGetCurrentSubscriptionUseCase } from '@/features/subscription/application/useCases/GetCurrentSubscriptionUseCase';
import { ICreateUserUseCase } from '@/features/users/application/useCases/CreateUserUseCase';
import { AuthErrorCode } from '@/features/auth/domain/valueObjects/AuthErrorCode';
import { UserDto } from '@/features/users/application/dtos/UserDto';
import { UserViewModel } from '@/features/users/presentation/models/UserViewModel';
import { UserMapper as PresentationUserMapper } from '@/features/users/presentation/mappers/UserMapper';
import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { IAuthStateSnapshot } from '@/features/auth/presentation/state/IAuthStateSnapshot';
import { ILoginUseCase } from '@/features/auth/application/useCases/LoginUseCase';
import { ILogoutUseCase } from '@/features/auth/application/useCases/LogoutUseCase';
import { ref } from 'vue';
import { SubscriptionDto } from '@/features/subscription/application/dtos/SubscriptionDto';
import { IRegisterUserWithOrganizationUseCase } from '@/features/auth/application/useCases/RegisterUserWithOrganizationUseCase';
import { IAuthenticatedUserContextUseCase } from '@/features/auth/application/useCases/GetAuthenticatedUserContextUseCase';
import { AuthenticatedUserDto } from '@/features/auth/application/dtos/AuthenticatedUserDto';

export class AuthState implements IAuthState {
  public user = ref<UserViewModel | undefined>({
    id: '',
    email: '',
    full_name: ''
  });
  public userContext = ref<AuthenticatedUserDto | null>(null);
  public subscription = ref<SubscriptionDto | null>(null)
  public isAuthenticated = ref<boolean>(false);

  private subscribers = new Set<(state: IAuthStateSnapshot) => void>();
  private stateHistory: IAuthStateSnapshot[] = [];
  private readonly STORAGE_KEY = 'auth_state';
  private _isAuthReady = false;

  constructor(
    private getCurrentSubscription: IGetCurrentSubscriptionUseCase,
    private getAuthenticatedUserContextUseCase: IAuthenticatedUserContextUseCase,
    private authUseCase: IAuthUseCase,
    private loginUseCase: ILoginUseCase,
    private logoutUseCase: ILogoutUseCase,
    private createUserUseCase: ICreateUserUseCase,
    private createUserWithOrganizationUseCase: IRegisterUserWithOrganizationUseCase,
    private settingPriceUseCase: ISettingPriceUseCase,
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
      userContext: this.userContext.value,
      isAuthenticated: this.isAuthenticated.value,
      timestamp: new Date(),
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
        this.userContext.value = snapshot.userContext;
        this.isAuthenticated.value = snapshot.isAuthenticated;
        this.stateHistory.push(snapshot);
      }
    } catch (error) {
      console.error('Failed to load persisted auth state:', error);
    }
  }

  async login(email: string, password: string): Promise<AuthenticatedUserDto | null> {

    try {
      // ───────────────────────────────────────────────────────
      // Login user
      // ───────────────────────────────────────────────────────
      await this.authUseCase.login.execute(email, password);

      // ───────────────────────────────────────────────────────
      // Hydrate authenticated user context
      // ───────────────────────────────────────────────────────
      const authenticatedUserContext =
        await this.getAuthenticatedUserContextUseCase.execute();

      // ───────────────────────────────────────────────────────
      // Store authenticated context
      // ───────────────────────────────────────────────────────
      this.userContext.value = authenticatedUserContext;

      this.isAuthenticated.value = true;

      this.pushState();

      return this.userContext.value;

    } catch (error) {
      console.error('AuthState login error:', error);

      if (error instanceof Error && error.message === "ACCOUNT_BLOCKED") {
        this.userContext.value = null;
        this.isAuthenticated.value = false;
        localStorage.removeItem(this.STORAGE_KEY);
        throw new AuthError(AuthErrorCode.LOGIN_FAILED, "Votre compte a ete bloque par un administrateur.", error);
      }

      this.isAuthenticated.value = true;

      throw new AuthError(
        AuthErrorCode.LOGIN_FAILED,
        'Login failed',
        error
      );
    }
  }

  // async login(email: string, password: string): Promise<void> {
  //   try {
  //     const userDto: UserDto = await this.authUseCase.login.execute(email, password);
  //     if (!userDto) {
  //       throw new AuthError(
  //         AuthErrorCode.AUTH_NO_USER_RETURNED,
  //         'No user returned after login'
  //       );
  //     }
  //     // Récupérer la subscription (non-bloquant si erreur)
  //     let subscription = null;
  //     try {
  //       subscription = await this.getCurrentSubscription.execute(userDto.id);
  //     } catch (subError) {
  //       console.warn('[AuthState] Could not fetch subscription, continuing login:', subError);
  //     }
  //     this.subscription.value = subscription;
  //     this.user.value = PresentationUserMapper.dtoToView(userDto);
  //     this.isAuthenticated.value = true;
  //     this.pushState();
      
  //   } catch (error) {
  //     console.error('AuthState login error:', error);
      
  //     // Réinitialisation de l'état en cas d'erreur
  //     this.user.value = {
  //       id: '',
  //       email: '',
  //       password: '',
  //       fullName: '',
  //       createdAt: ''
  //     };
  //     this.isAuthenticated.value = false;
  //     this.subscription.value = null;
  //     throw new AuthError(
  //       AuthErrorCode.LOGIN_FAILED,
  //       'Login failed',
  //       error
  //     );
  //   }
  // }

  async register(email: string, password: string, fullName: string): Promise<void> {
    try {
      const user: UserDto = await this.createUserWithOrganizationUseCase.execute(email, password, fullName);
      
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
    } catch (error) {
      throw new AuthError(
        AuthErrorCode.REGISTRATION_FAILED,
        'Registration failed',
        error
      );
    }

    // ➕ Lier automatiquement le plan 'free'
    // const subscription = await this.authUseCase.subscribeToFreePlan.execute(this.user.value.id);
    // this.subscription.value = subscription;
    // this.user.value.subscription = subscription;
  }

 async logout(): Promise<void> {
    try {
      await this.authUseCase.logout.execute();
      
      this.user.value = { id: '', email: '', full_name: '' };
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

  get isFreePlan(): boolean {
    return this.subscription.value?.subscriptionPlan.name === 'free'
  }

  async refreshAuthenticatedUser(): Promise<void> {
    try {
      // Vérifie d'abord la session Supabase
      const hasSession = await this.getAuthenticatedUserContextUseCase.hasActiveSession();
      if (!hasSession) {
        console.warn('[AuthState] Pas de session Supabase, déconnexion.');
        this.userContext.value = null;
        this.isAuthenticated.value = false;
        localStorage.removeItem(this.STORAGE_KEY);
        return;
      }

      try {
        const authenticatedUserContext = await this.getAuthenticatedUserContextUseCase.execute();
        this.userContext.value = authenticatedUserContext;
        this.isAuthenticated.value = true;
        this.pushState();
      } catch (profileError) {
        if (profileError instanceof Error && profileError.message === "ACCOUNT_BLOCKED") {
          this.userContext.value = null;
          this.isAuthenticated.value = false;
          localStorage.removeItem(this.STORAGE_KEY);
          return;
        }
        console.error("[AuthState] Erreur hydratation profil, session Supabase OK:", profileError);
        this.isAuthenticated.value = true;
      }
    } catch (error) {
      console.error('Failed to refresh authenticated user (unexpected error)', error);
      this.userContext.value = null;
      this.isAuthenticated.value = false;
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  setAuthReady(value: boolean) {
    this._isAuthReady = value;
  }
  
  /**
   * Getter pratique pour obtenir le booléen d'authentification
   */
  get isAuthenticatedValue(): boolean {
    return this.isAuthenticated.value;
  }
}
