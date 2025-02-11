export interface IClient {
  from(table: string): unknown;
  auth: {
    signIn(email: string, password: string): Promise<UserDto>;
    signUp(email: string, password: string): Promise<unknown>;
    signOut(): Promise<unknown>;
    onAuthStateChange(callback: (event: string, session: any) => void): void;
  };
  storage: unknown;
}