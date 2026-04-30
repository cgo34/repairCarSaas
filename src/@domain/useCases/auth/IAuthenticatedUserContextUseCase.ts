import { AuthenticatedUserDto } from "@/@application/dtos/AuthenticatedUserDto";

export interface IAuthenticatedUserContextUseCase {
  execute(): Promise<AuthenticatedUserDto>;
}
