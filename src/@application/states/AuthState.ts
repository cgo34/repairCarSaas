import { AuthError } from '@/@domain/errors/AuthError';
import { IAuthUseCase } from '@/@domain/useCases/auth/IAuthUseCase';
import { AuthErrorCode } from '@/@domain/valueObjects/AuthErrorCode';
import { User } from '@domain/entities/User';
import { IAuthState } from '@domain/states/IAuthState';
import { IAuthStateSnapshot } from '@domain/states/IAuthStateSnapshot';
import { ILoginUseCase } from '@domain/useCases/auth/ILoginUseCase';
import { ILogoutUseCase } from '@domain/useCases/auth/ILogoutUseCase';
import { SYMBOLS } from '@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';
import { ref } from 'vue';

@injectable()
export class AuthState implements IAuthState {
  public user = ref<User>({
    email: '',
    password: '',
    fullName: ''
  });
  public isAuthenticated = ref<boolean>(false);

  private subscribers = new Set<(state: IAuthStateSnapshot) => void>();
  private stateHistory: IAuthStateSnapshot[] = [];
  private readonly STORAGE_KEY = 'auth_state';
  private _isAuthReady = false;

  constructor(
    @inject(SYMBOLS.UseCases.Auth.Container) private authUseCase: IAuthUseCase,
    @inject(SYMBOLS.UseCases.Auth.LoginUseCase) private loginUseCase: ILoginUseCase,
    @inject(SYMBOLS.UseCases.Auth.LogoutUseCase) private logoutUseCase: ILogoutUseCase
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
        this.stateHistory.push(snapshot);
      }
    } catch (error) {
      console.error('Failed to load persisted auth state:', error);
    }
  }

  async login(email: string, password: string): Promise<void> {
    try {
      const user = await this.authUseCase.login.execute(email, password);
      
      if (!user) {
        throw new AuthError(
          AuthErrorCode.AUTH_NO_USER_RETURNED,
          'No user returned after login'
        );
      }

      this.user.value = user;
      this.isAuthenticated.value = true;
      this.pushState();
      
    } catch (error) {
      console.error('AuthState login error:', error);
      
      // Réinitialisation de l'état en cas d'erreur
      this.user.value = {
        email: '',
        password: '',
        fullName: ''
      };
      this.isAuthenticated.value = false;

      throw new AuthError(
        AuthErrorCode.LOGIN_FAILED,
        'Login failed',
        error
      );
    }
  }

  async register(email: string, password: string, fullName: string): Promise<void> {
    try {
      const session = await this.authUseCase.register.execute(email, password, fullName);
      
      if (!session?.user) {
        throw new AuthError(
          AuthErrorCode.REGISTRATION_FAILED,
          'Registration failed: no user returned'
        );
      }
  
      // Mise à jour de l'état
      this.user.value = session.user;
      this.isAuthenticated.value = true;
      
      // Utilisation des méthodes communes
      this.pushState();
      
    } catch (error) {
      throw new AuthError(
        AuthErrorCode.REGISTRATION_FAILED,
        'Registration failed',
        error
      );
    }
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

  setAuthReady(value: boolean) {
    this._isAuthReady = value;
  }
}
