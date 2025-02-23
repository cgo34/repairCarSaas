import { User } from "@domain/entities/User";

export interface IAuthStateSnapshot {
  user: User | null;
  isAuthenticated: boolean;
  timestamp: Date;
}