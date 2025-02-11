import { User } from "@domain/entities/User";
import { IAuthStateSnapshot } from "@domain/states/IAuthStateSnapshot";
import { Ref } from "vue";

export interface IAuthState {
    user: Ref<User | undefined>;
    isAuthenticated: Ref<boolean>;
    isAuthReady: boolean;
    login(email: string, password: string): Promise<void>;
    register(email: string, password: string, fullName: string): Promise<void>;
    logout(): Promise<void>;
    subscribe(callback: (state: IAuthStateSnapshot) => void): () => void;
    getLastState(): IAuthStateSnapshot;
    getHistory(): IAuthStateSnapshot[];
    setAuthReady(value: boolean): void;
  }
  