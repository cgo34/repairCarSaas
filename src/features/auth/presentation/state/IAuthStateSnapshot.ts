import { UserViewModel } from "@/features/users/presentation/models/UserViewModel";
import { AuthenticatedUserDto } from "@/features/auth/application/dtos/AuthenticatedUserDto";

export interface IAuthStateSnapshot {
  user: UserViewModel | undefined;
  userContext: AuthenticatedUserDto | null;
  isAuthenticated: boolean;
  timestamp: Date;
}