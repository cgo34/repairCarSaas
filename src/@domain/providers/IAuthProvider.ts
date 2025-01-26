export interface IAuthProvider {
    signInWithPassword(email: string, password: string): Promise<any>;
    signUp(email: string, password: string): Promise<any>;
    signOut(): Promise<void>;
    getSession(): Promise<any>;
    onAuthStateChange(callback: (event: string, session: any) => void): void;
  }
  