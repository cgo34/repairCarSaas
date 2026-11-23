import type { Container } from 'inversify';
import { SYMBOLS } from '@/app/di/tokens';
import { useTechniciansState } from '@/features/technicians/composition/useTechniciansState';
import { useTechnicianDetailState } from '@/features/technicians/composition/useTechnicianDetailState';
import { IUseTechniciansState } from '@/features/technicians/presentation/types/IUseTechniciansState';
import { IUseTechnicianDetailState } from '@/features/technicians/presentation/types/IUseTechnicianDetailState';
import { ITechnicianGarageAccessRepository } from '@/features/technicians/application/ports/repositories/ITechnicianGarageAccessRepository';
import { TechnicianGarageAccessRepository } from '@/features/technicians/infrastructure/repositories/TechnicianGarageAccessRepository';
import { IGetTechnicianStatsUseCase } from '@/features/technicians/application/useCases/GetTechnicianStatsUseCase';
import { GetTechnicianStatsUseCase } from '@/features/technicians/application/useCases/GetTechnicianStatsUseCase';
import { CreateOrganizationTechnicianUseCase } from '@/features/technicians/application/useCases/CreateOrganizationTechnicianUseCase';
import { ICreateOrganizationTechnicianUseCase } from '@/features/technicians/application/useCases/CreateOrganizationTechnicianUseCase';

export function registerTechniciansBindings(container: Container): void {
  container.bind<ITechnicianGarageAccessRepository>(SYMBOLS.Repositories.TechnicianGarageAccessRepository).toDynamicValue(ctx => new TechnicianGarageAccessRepository(ctx.container.get(SYMBOLS.Providers.ClientProvider))).inSingletonScope();
  container.bind<ICreateOrganizationTechnicianUseCase>(SYMBOLS.UseCases.CreateOrganizationTechnicianUseCase).toDynamicValue(ctx => new CreateOrganizationTechnicianUseCase(ctx.container.get(SYMBOLS.Repositories.AuthRepository), ctx.container.get(SYMBOLS.Repositories.UserRepository), ctx.container.get(SYMBOLS.Repositories.OrganizationMemberRepository))).inSingletonScope();
  container.bind<IGetTechnicianStatsUseCase>(SYMBOLS.UseCases.TechnicianStats).toDynamicValue(ctx => new GetTechnicianStatsUseCase(ctx.container.get(SYMBOLS.Providers.ClientProvider))).inSingletonScope();
  container.bind<IUseTechniciansState>(SYMBOLS.States.TechniciansState).toDynamicValue(() => {
    return useTechniciansState();
  });
  container.bind<IUseTechnicianDetailState>(SYMBOLS.States.TechnicianDetailState).toDynamicValue(() => {
    return useTechnicianDetailState();
  });
}
