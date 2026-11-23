import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { IOrganizationMemberUseCase } from '@/features/organizations/application/useCases/OrganizationMemberUseCase';
import { ICreateOrganizationTechnicianUseCase } from '@/features/technicians/application/useCases/CreateOrganizationTechnicianUseCase';
import { ITechnicianGarageAccessRepository } from '@/features/technicians/application/ports/repositories/ITechnicianGarageAccessRepository';
import { IGarageUseCase } from '@/features/garages/application/useCases/GarageUseCase';
import { IUserUseCase } from '@/features/users/application/useCases/UserUseCase';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';
import { createUseOrganizationMember } from '@/features/organizations/presentation/composables/useOrganizationMember';

export function useOrganizationMember() {
  return createUseOrganizationMember({
    authState: container.get<IAuthState>(SYMBOLS.States.AuthState),
    organizationMemberUseCase: container.get<IOrganizationMemberUseCase>(SYMBOLS.UseCases.OrganizationMemberUseCase),
    createOrganizationTechnicianUseCase: container.get<ICreateOrganizationTechnicianUseCase>(SYMBOLS.UseCases.CreateOrganizationTechnicianUseCase),
    garageAccessRepo: container.get<ITechnicianGarageAccessRepository>(SYMBOLS.Repositories.TechnicianGarageAccessRepository),
    garageUseCase: container.get<IGarageUseCase>(SYMBOLS.UseCases.Garage),
    userUseCase: container.get<IUserUseCase>(SYMBOLS.UseCases.UserUseCase),
  });
}
