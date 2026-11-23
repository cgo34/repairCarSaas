import { SubscriptionDto } from "@/features/subscription/application/dtos/SubscriptionDto";
import { UserViewModel } from "@/features/users/presentation/models/UserViewModel";
import { IAuthStateSnapshot } from "@/features/auth/presentation/state/IAuthStateSnapshot";
import { AuthenticatedUserDto } from "@/features/auth/application/dtos/AuthenticatedUserDto";
import { Ref } from "vue";

export interface IAuthState {
    user: Ref<UserViewModel | undefined>;
    userContext: Ref<AuthenticatedUserDto | null>;
    subscription: Ref<SubscriptionDto | null>;
    isAuthenticated: Ref<boolean>;
    readonly isAuthenticatedValue: boolean;
    isAuthReady: boolean;
    isFreePlan: boolean;
    login(email: string, password: string): Promise<AuthenticatedUserDto | null>;
    refreshAuthenticatedUser(): Promise<void>;
    register(email: string, password: string, fullName: string): Promise<void>;
    logout(): Promise<void>;
    subscribe(callback: (state: IAuthStateSnapshot) => void): () => void;
    getLastState(): IAuthStateSnapshot;
    getHistory(): IAuthStateSnapshot[];
    setAuthReady(value: boolean): void;
  }
  