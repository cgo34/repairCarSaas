export interface IAuthRepository {
    login(email: string, password: string): Promise<any>;
    register(email: string, password: string): Promise<any>;
    logout(): Promise<void>;
    getCurrentUser(): Promise<any>;
    onAuthStateChange(callback: (event: string, session: any) => void): void;
 }
 